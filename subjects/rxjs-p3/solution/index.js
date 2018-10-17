import '../util/polyfill'; // first import polyfills
import expect from 'expect-legacy';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer, zip, range } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, filter, map, mergeMap, retryWhen, switchMap, tap, skip } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';
import FAKE_API_JSON from '../../../public/fake-api.json'; // only for comparison

Error.stackTraceLimit = 3; // limit size of stack trace in chrome



describe('rxjs', () => {

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

  it('using interval observable which emits every 0.1s, skip first 2 values and take a total of 3 values', done => {
    /* TODO 9  */

    const ob8c$ = interval(100)
      .pipe(
        skip(2),
        take(3)
      );

    const expected = [2,3,4];
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

  it('create an observable which adds values from two other observables and emits each total', done => {
    /* TODO 10  */
    const a$ = of(10, 20, 30);
    const b$ = of(1, 2, 3);

    const ob8c$ = zip(a$, b$)
      .pipe(
        map(x => x[0] + x[1])
      );

    const expected = [11,22,33];
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

  it('use mergeMap to make three ajax requests to /fake-api.json and emit all each of the results', done => {
    /* TODO 11  */
    const ob8c$ = range(0, 3)
      .pipe(
        mergeMap(x => ajax({
          url: `/fake-api.json`,
          crossDomain: true,
          responseType: 'json'
        })),
        map(ret => ret.response)  /* use results prop of payload */
      );

    const expected = [
      {
        "items": [
          {
            "id": 1,
            "name": "Foo"
          },
          {
            "id": 2,
            "name": "Bar"
          },
          {
            "id": 3,
            "name": "Baz"
          }
        ]
      },
      {
        "items": [
          {
            "id": 1,
            "name": "Foo"
          },
          {
            "id": 2,
            "name": "Bar"
          },
          {
            "id": 3,
            "name": "Baz"
          }
        ]
      },
      {
        "items": [
          {
            "id": 1,
            "name": "Foo"
          },
          {
            "id": 2,
            "name": "Bar"
          },
          {
            "id": 3,
            "name": "Baz"
          }
        ]
      }
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




});


mocha.run();
