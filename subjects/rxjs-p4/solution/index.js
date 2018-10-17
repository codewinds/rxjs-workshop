import '../util/polyfill'; // first import polyfills
import expect from 'expect-legacy';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, filter, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';
import FAKE_API_JSON from '../../../public/fake-api.json'; // only for comparison

Error.stackTraceLimit = 3; // limit size of stack trace in chrome



describe('rxjs', () => {

  it('send and receive from webSocket', done => {
    /*
       TODO send and receive from a webSocket ws://localhost:8010
       TODO 9a create a webSocket subject connected to ws://localhost:8010
       TODO 9b send 'foo'
       TODO 9c send 'bar'
       TODO 9d receive all (2) messages from ws, add to arrReceived
       TODO 9e after receiving 2 messages, close connection to WS
       TODO 9f after WS closes, call checkArrReceived
     */
    const url = 'ws://localhost:8010'; // local WS echo service
    const arrReceived = []; // messages received from ws
    const wsSubject = webSocket({
      url,
      resultSelector: x => x.data  // default does JSON.parse(x.data)
    });
    // send to WS, will be queued until connected with subscribe
    wsSubject.next('foo');
    wsSubject.next('bar');
    wsSubject.subscribe(
      x => {
        arrReceived.push(x);
        if (arrReceived.length === 2) {
          wsSubject.complete(); // close connection
        }
      },
      err => done(err),
      () => checkArrReceived()
    );
    expect(wsSubject).toBeA(Subject, 'expected wsSubject to be a webSocket subject');
    function checkArrReceived() {
      expect(arrReceived).toEqual(['foo', 'bar']);
      done();
    }
  });

  it('send and receive from reconnecting webSocket', done => {
    /*
       TODO send and receive from an auto-reconnecting webSocket
       TODO track the opens and closes via a wsConnected$ subject
       TODO 10a create an openObserver subject
       TODO 10b create a closeObserver subject
       TODO 10c merge openObserver and closeObserver into wsConnected$ which emits true if connected, false if disconnected
       TODO 10a create a webSocket subject connected to ws://localhost:8010 using the openObserver and closeObserver to track connection
       TODO 10b create a reconnecting WS observable that reconnects after 1s delay on failure
       TODO 10c create a new subject rwsSubject which combines the write side of your webSocket subject and the read side of the reconnecting WS observable
       TODO 10d listen to wsConnected$ and when it emits a false indicating the connection closed, call checkArrReceived
       TODO 10e send 'foo' using rwsSubject
       TODO 10f send 'bar' using rwsSubject
       TODO 10g receive all (2) messages from rwsSubject, add to arrReceived
       TODO 10h after receiving 2 messages, close connection to WS
     */
    const url = 'ws://localhost:8010'; // local WS echo service
    const arrReceived = []; // messages received from ws
    // for tracking WS connections
    const openObserver = new Subject();
    const closeObserver = new Subject();
    const wsConnected$ = merge(
      openObserver.pipe(map(() => true)),  // ws is connected
      closeObserver.pipe(map(() => false)) // ws is disconnected
    );

    const wsSubject = webSocket({
      url,
      openObserver, // track WS connection opens
      closeObserver, // track WS disconnects
      resultSelector: x => x.data  // default does JSON.parse(x.data)
    });

    // make a reconnecting WS listener, delay 1s after err
    const reconWebSocket$ = wsSubject
      .pipe(
        retryWhen(errors =>
          errors
            .pipe(
              tap(err => console.error(err)),
              switchMap(err => timer(1000))
            )
        )
      )

    // combine the write side of webSocket Subject with
    // reconnecting read side of reconWebSocket$ into one subject
    const rwsSubject = Subject.create(
      wsSubject,
      reconWebSocket$
    );

    wsConnected$
      .pipe(filter(x => x === false)) // only false, closes
      .subscribe(() => checkArrReceived());

    // send to WS, will be queued until connected with subscribe
    rwsSubject.next('foo');
    rwsSubject.next('bar');
    rwsSubject.subscribe(
      x => {
        arrReceived.push(x);
        if (arrReceived.length === 2) {
          rwsSubject.complete(); // close connection
        }
      },
      err => done(err)
    );
    expect(rwsSubject).toBeA(Subject, 'expected rwsSubject to be a webSocket subject');
    expect(wsConnected$).toBeAn(Observable, 'expected wsConnected$ to be an Observable');
    function checkArrReceived() {
      expect(arrReceived).toEqual(['foo', 'bar']);
      done();
    }
  });

  it('see rxjs-workshop/examples/vue/exercise, npm start, open localhost:3000 and use app');
  it('see rxjs-workshop/examples/vue/exercise, add rxjs@6');
  it('see rxjs-workshop/examples/vue/exercise, use rxjs to convert result from axios method (promise) into observable, subscribe, and use value');

  it('see rxjs-workshop/examples/angular/exercise, npm start, open localhost:4200 and use app');
  it('see rxjs-workshop/examples/angular/exercise-updated, npm install, update files using rxjs to use rxjs@6 imports and pipe operations');

  it('see rxjs-workshop/examples/react/exercise, npm start, open localhost:3000 and use app');
  it('see rxjs-workshop/examples/react/exercise, convert async processes in src/features/load-save-localforage-rxjs/index.js to use observables');

});


mocha.run();
