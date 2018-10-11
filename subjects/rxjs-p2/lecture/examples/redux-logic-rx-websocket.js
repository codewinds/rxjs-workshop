import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogic, createLogicMiddleware } from 'redux-logic';
import { connect, Provider } from 'react-redux';
import { Subject, merge, timer } from 'rxjs';
import { map, retryWhen, tap, switchMap } from 'rxjs/operators';
import { webSocket } from 'rxjs/websocket';

// use redux-devtools-extension if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
   redux-logic reconnecting websocket
   - send messages via WS to echo server
   - receive messages from echo WS and display
   - can disconnect WS
   - reconnects on send
 */

const initialState = {
  list: [],    // list of response messages from echo.webserver.org
  sendMsg: '', // message we are preparing to send via WS to echo.webserver.org
  wsEchoConnected: false,  // ws connected?
  wsListening: false
};

// create auto-reconnecting websocket subject
function createReconWSSubject(url) {
  // for tracking WS connections
  const openObserver = new Subject();
  const closeObserver = new Subject();
  const wsConnected$ = merge(
    openObserver.pipe(map(() => true)),  // ws is connected
    closeObserver.pipe(map(() => false)) // ws is disconnected
  );

  const webSocketSubject = webSocket({
    url,
    openObserver, // track WS connection opens
    closeObserver, // track WS disconnects
    resultSelector: x => x.data   // default does JSON.parse
  });

  // make a reconnecting WS listener, delay 1s after err
  const reconWebSocket$ = webSocketSubject
    .pipe(
      retryWhen(errors =>
        errors
          .pipe(
            tap(err => console.error(err)),
            switchMap(err => timer(1000))
          )
      )
    );

  // combine the write side of webSocketSubject with
  // reconnecting read side of reconWebSocket$ into one subject
  const reconWebSocketSubject = Subject.create(
    webSocketSubject,
    reconWebSocket$
  );

  // let's add wsConnected$ as a property connected$
  reconWebSocketSubject.connected$ = wsConnected$;

  return reconWebSocketSubject;
}

const SEND_MSG_CHANGED = 'SEND_MSG_CHANGED';
const MSG_SEND = 'MSG_SEND';
const MSG_LISTEN = 'MSG_LISTEN';
const MSG_STOP_LISTENING = 'MSG_STOP_LISTENING';
const MSG_REC = 'MSG_REC';
const MSG_ERROR = 'MSG_ERROR';
const WS_CONNECT = 'WS_CONNECT';
const WS_DISCONNECT = 'WS_DISCONNECT';

function msgRec(msg) {
  return { type: MSG_REC, payload: msg };
}

function sendMsgChanged(ev) {
  return { type: SEND_MSG_CHANGED, payload: ev.target.value };
}
function sendMsgSubmit(ev) {
  ev.preventDefault();
  return { type: MSG_SEND };
}

function startListening() {
  return { type: MSG_LISTEN };
}

function stopListening() {
  return { type: MSG_STOP_LISTENING };
}

// logic for sending messages to echo service via WS
const msgSendLogic = createLogic({
  type: MSG_SEND,

  // only send WS message if we have non-empty message to send
  // save the sendMsg in ctx for process hook, so reducer can clear.
  // Reducer runs between validate and process hook.
  validate({ getState, action, ctx }, allow, reject) {
    const sendMsg = getState().sendMsg;
    if (sendMsg) {
      ctx.sendMsg = sendMsg; // save so reducer can clear out
      allow(action);
    } else { // empty request, silently reject
      reject();
    }
  },

  processOptions: {
    failType: MSG_ERROR
  },

  // use wsSubject injected from configureStore logic deps
  process({ rwsEchoSubject, ctx }) {
    const sendMsg = ctx.sendMsg; // was set in validate
    console.log('sending', sendMsg);
    rwsEchoSubject.next(sendMsg);
    return { type: MSG_LISTEN }; // listen if not already
  }
});

// connect to WS and listen for messages
const msgListenLogic = createLogic({
  type: MSG_LISTEN,  // start listening on this action type
  cancelType: MSG_STOP_LISTENING, // stop listening on this action type
  warnTimeout: 0,

  // only proceed if not already connected
  validate({ getState, action }, allow, reject) {
    const listening = getState().wsListening;
    if (!listening) { return allow(action); }
    return reject(); // silently eat, already connected
  },

  processOptions: {
    successType: msgRec, // action creator to apply to WS messages
    failType: MSG_ERROR // action type to use for WS errors
  },

  // listen to WS observable for messages and dispatch
  // use rwsEchoSubject injected from configureStore logic deps
  process({ rwsEchoSubject, getState, action }) {
    return rwsEchoSubject; // observable listen for WS msgs & dispatch
  }
});

const rwsEchoSubject = createReconWSSubject('ws://localhost:8010');

const deps = { // injected dependencies for logic
  rwsEchoSubject // subject for RW to echo WS service
};
const arrLogic = [msgSendLogic, msgListenLogic];
const logicMiddleware = createLogicMiddleware(arrLogic, deps);
const store = createStore(reducer, initialState,
  composeEnhancers(applyMiddleware(logicMiddleware)));

rwsEchoSubject.connected$.subscribe(
  connected => {
    store.dispatch({ type: (connected) ? 'WS_CONNECT' : 'WS_DISCONNECT' });
  }
);
store.dispatch(startListening()); // start listening to webSocket

const ConnectedApp = connect(
  state => ({
    messages: state.list,
    sendMsg: state.sendMsg,
    wsEchoConnected: state.wsEchoConnected,
    wsListening: state.wsListening
  }),
  {
    sendMsgChanged,
    sendMsgSubmit,
    startListening,
    stopListening
  }
)(App);

function App({ messages, sendMsg, wsEchoConnected, wsListening,
               sendMsgChanged, sendMsgSubmit, startListening, stopListening }) {
  return (
    <div>
    <h2>redux-logic-rx-websocket</h2>
    <div>Send message to echo WS at ws://localhost:8010</div>
    <div><b>Status: { wsEchoConnected ? 'Connected' : 'Disconnected' }</b></div>
    <div><b>Listening: { wsListening ? 'true' : 'false' }</b></div>
    <form onSubmit={ sendMsgSubmit }>
    <input autoFocus={true} value={ sendMsg }
    onChange={ sendMsgChanged }
    placeholder="msg to send" />
    <button>Send</button>
    </form>
    <h4>Responses from echo WS</h4>
    <ul>
    {
      messages.map(msg => (
        <li>{ msg }</li>
      ))
    }
    </ul>
    { (wsListening) ? <button onClick={ stopListening }>Stop Listening</button> :
      <button onClick={ startListening }>Start Listening</button> }
    </div>
  );
}

ReactDOM.render(
  <Provider store={ store }>
  <ConnectedApp />
  </Provider>,
  document.getElementById('appContainer')
);

function reducer(state = initialState, action) {
  switch (action.type) {
    case MSG_LISTEN:
      return {
        ...state,
        wsListening: true
      };
    case MSG_STOP_LISTENING:
      return {
        ...state,
        wsListening: false
      };
    case WS_CONNECT:
      return {
        ...state,
        wsEchoConnected: true
      };
    case WS_DISCONNECT:
      return {
        ...state,
        wsEchoConnected: false
      };
    case SEND_MSG_CHANGED:
      return {
        ...state,
        sendMsg: action.payload
      };
    case MSG_SEND:
      return {
        ...state,
        sendMsg: ''
      };
    case MSG_REC:
      return {
        ...state,
        list: state.list.concat(action.payload)
      };
    default:
      return state;
  }
}
