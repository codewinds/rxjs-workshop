import '../util/polyfill'; // first import polyfills
import expect from 'expect-legacy';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, filter, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';
import FAKE_API_JSON from '../../../public/fake-api.json'; // only for comparison

Error.stackTraceLimit = 3; // limit size of stack trace in chrome



describe('rxjs', () => {

  /* Using Observable.create */

  it('use Observable.create to emit A, B, C and complete', done => {
    // TODO 1a - create observable that emits 3 items and completes
    const ob1a$ = Observable.create(obs => {
      obs.next('A');
      obs.next('B');
      obs.next('C');
      obs.complete();
    });

    const expected = ['A', 'B', 'C'];
    const found = [];
    ob1a$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });

  it('use Observable.create to emit 2 items and then error', done => {
    // TODO 1b - create observable that emits 2 items then errors
    const ob1b$ = Observable.create(obs => {
      obs.next(1);
      obs.next(2);
      obs.error(new Error('my error in 1b'));
    });

    const expected = [1, 2];
    const found = [];
    ob1b$.subscribe({
      next: x => found.push(x),
      error: err => {
        expect(found).toEqual(expected);
        done();
      },
      complete: () => done(new Error('should not complete'))
    });
  });

  it('use Observable.create emits no items and completes', done => {
    // TODO 1c - create observable that emits 0 items and completes
    const ob1c$ = Observable.create(obs => {
      obs.complete();
    });

    const expected = [];
    const found = [];
    ob1c$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });

  /* Using Observable of */

  it('use Observable of to emit one item', done => {
    // TODO 2a - create observable that emits 1 item string '2A'
    const ob2a$ = of('2A');

    const expected = ['2A'];
    const found = [];
    ob2a$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });

  it('use Observable of to emit A, B, C', done => {
    // TODO 2b - create observable that emits 3 items A, B, C
    const ob2b$ = of('A', 'B', 'C');

    const expected = ['A', 'B', 'C'];
    const found = [];
    ob2b$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  it('use Observable of to create empty observable', done => {
    // TODO 2c - create observable that emits 0 items
    const ob2c$ = of();

    const expected = [];
    const found = [];
    ob2c$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  /* Using Observable throwError */

  it('use Observable throwError to create observable that errors', done => {
    // TODO 3a - create observable that errors
    const ob3a$ = throwError(new Error('my error 3a'));

    const expected = [];
    const found = [];
    ob3a$.subscribe({
      next: x => found.push(x),
      error: err => {
        expect(found).toEqual(expected);
        done();
      },
      complete: () => done(new Error('should not complete since errors'))
    });
  });

  it('make err obs but catch and emit obj instead', done => {
    // TODO 3b - create observable that errors, but catch and emit an
    // object instead
    const ob3b$ = throwError(new Error('error 3b'))
      .pipe(
        catchError(err => of({
          type: 'ERROR_3B',
          error: true
        }))
      )

    const expected = [
      { type: 'ERROR_3B', error: true }
    ];
    const found = [];
    ob3b$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  /* Using Observable from */

  it('create observable from a promise', done => {
    // TODO 4 - create observable from a promise
    const prom4 = new Promise((resolve, reject) => {
      resolve(4);
    });
    const ob4$ = from(prom4);

    const expected = [4];
    const found = [];
    ob4$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  /* Using any observable methods and piping operators */

  it('obs emits every 0.1s, only 5 times, filters odd, multi by 100', done => {
    // TODO 5 create observable incr every 0.1 seconds start with 0
    // TODO 5b and stops emitting after 5 values
    // TODO 5c and filters out odd values
    // TODO 5d and multiplies value by 100
    const ob5$ = interval(100)
      .pipe(
        take(5),
        filter(x => !(x % 2)),
        map(x => x * 100)
      );

    const expected = [0, 200, 400];
    const found = [];

    ob5$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  /* Using Observable ajax.getJSON */


  it('use Observable ajax to fetch /fake-api.json and return object', done => {
    // TODO 6 fetch '/fake-api.json' and transform into
    // an action object FETCH_SUCCESS with the results as the payload.
    // Also catch any error and emit an error action FETCH_ERROR with
    // the error as its payload
    const ob6$ = ajax.getJSON('/fake-api.json')
      .pipe(
        map(data => data.items),
        map(items => ({
          type: 'FETCH_SUCCESS',
          payload: items
        })),
        catchError(err => of({
          type: 'FETCH_ERROR',
          payload: err,
          error: true
        }))
      );

    const expected = [
      {
        type: 'FETCH_SUCCESS',
        payload: FAKE_API_JSON.items
      }
    ];
    const found = [];
    ob6$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });

  /* Using Observable interval(1000).take(2) with mergeMap to trigger
     Observable ajax.getJSON('/fake-api.json') like in step 6
     Hint: you can reuse ob6$ */

  it('every 0.5s use mergeMap to fetch ajax, only twice', done => {
    // TODO 7a have an interval observable trigger a refresh of items
    // once every 0.5s for 1 second and emit actions for each (like previous)
    const fetch$ = ajax.getJSON('/fake-api.json')
      .pipe(
        map(data => data.items),
        map(items => ({
          type: 'FETCH_SUCCESS',
          payload: items
        })),
        catchError(err => of({
          type: 'FETCH_ERROR',
          payload: err,
          error: true
        }))
      );

    const ob7a$ = interval(500)
      .pipe(
        take(2),
        mergeMap(x => fetch$)
      );

    const expected = [
      {
        type: 'FETCH_SUCCESS',
        payload: FAKE_API_JSON.items
      },
      {
        type: 'FETCH_SUCCESS',
        payload: FAKE_API_JSON.items
      }
    ];
    const found = [];
    ob7a$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  it('like previous but throttle 1/s', done => {
    // TODO 7b like 7a, but throttle the requests so there is only
    // a max of 1 request per second (resulting in a single request)
    const fetch$ = ajax.getJSON('/fake-api.json')
      .pipe(
        map(data => data.items),
        map(items => ({
          type: 'FETCH_SUCCESS',
          payload: items
        })),
        catchError(err => of({
          type: 'FETCH_ERROR',
          payload: err,
          error: true
        }))
      );

    const ob7b$ = interval(500)
      .pipe(
        take(2),
        throttleTime(1000),
        mergeMap(x => fetch$)
      );

    const expected = [
      {
        type: 'FETCH_SUCCESS',
        payload: FAKE_API_JSON.items
      }
    ];
    const found = [];
    ob7b$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  it('like 7a but debounce for 0.6s', done => {
    // TODO 7c like 7a, but debounce the requests so it won't make
    // a request until there has been a pause of more than 3 seconds
    const fetch$ = ajax.getJSON('/fake-api.json')
      .pipe(
        map(data => data.items),
        map(items => ({
          type: 'FETCH_SUCCESS',
          payload: items
        })),
        catchError(err => of({
          type: 'FETCH_ERROR',
          payload: err,
          error: true
        }))
      );

    const ob7c$ = interval(500)
      .pipe(
        take(2),
        debounceTime(600),
        mergeMap(x => fetch$)
      );

    const expected = [
      {
        type: 'FETCH_SUCCESS',
        payload: FAKE_API_JSON.items
      }
    ];
    const found = [];
    ob7c$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });


  it('use Observable combineLatest to combine two obs', done => {
    /* TODO 8 Using Observable combineLatest combine the latest values from
       2 observables into one observable emitting an object with both values
     */

    const ob8a$ = interval(100)
      .pipe(
        take(3),
        map(x => x * 100)
      );
    const ob8b$ = interval(30)
      .pipe(
        take(5)
      );
    // TODO 8 - use combineLatest to combine the latest values from ob8a$
    // and ob8b$ emitting an object with the values from each
    const ob8c$ = combineLatest(
      ob8a$,
      ob8b$,
      (a, b) => ({
        a,
        b
      })
    );

    const expected = [
      { a: 0, b: 2 },
      { a: 0, b: 3 },
      { a: 0, b: 4 },
      { a: 100, b: 4 },
      { a: 200, b: 4 }
    ];
    const found = [];
    ob8c$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });
  });

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



});


mocha.run();
