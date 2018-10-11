import React from 'react';
import ReactDOM from 'react-dom';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { combineEpics, createEpicMiddleware, ofType } from 'redux-observable';

// locate a div in our html where we want to render
const appContainerDiv = document.querySelector('#appContainer');

function fetchEpic(action$) {
  return action$
    .pipe(
      ofType('FETCH_FOO'),
      mergeMap(action =>
        ajax.getJSON('/fake-api.json')
          .pipe(
            map(payload => payload.items), // use items property
            map(items => ({
              type: 'FETCH_FOO_SUCCESS',
              payload: items
            })),
            catchError(err => of({
              type: 'FETCH_FOO_FAILED',
              payload: err,
              error: true
            }))
          )
      )
    );
}

const rootEpic = combineEpics(
  fetchEpic
  // other epics could go here
);

const epicMiddleware = createEpicMiddleware();

const actions = {
  fetchFoo(ev) {
    return { type: 'FETCH_FOO' };
  }
};

const initialState = {
  status: '',
  items: []
};
function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FETCH_FOO':
      return {
        ...state,
        status: 'fetching...'
      };
    case 'FETCH_FOO_SUCCESS':
      return {
        ...state,
        items: action.payload,
        status: ''
      };
    case 'FETCH_FOO_FAILED':
      return {
        ...state,
        status: action.payload.toString()
      };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);


function App({ items, status, fetchItems }) {
  return (
    <div>
      <h2>redux-observable</h2>
      <button onClick={fetchItems}>Fetch</button>
      <div>Status: { status }</div>
      <ul>
        { items.map(item =>
          <li key={item.id}>{ item.name }</li> ) }
      </ul>
    </div>
  );
}

const CApp = connect(
  state => ({
    items: state.items,
    status: state.status
  }),
  {
    fetchItems: actions.fetchFoo
  }
)(App);

ReactDOM.render(
  <Provider store={store}>
    <CApp />
  </Provider>,
  appContainerDiv
);
