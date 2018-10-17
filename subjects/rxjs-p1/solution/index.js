import '../util/polyfill'; // first import polyfills
import expect from 'expect-legacy';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, filter, map, mergeMap, retryWhen, switchMap, tap, reduce } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';
import FAKE_API_JSON from '../../../public/fake-api.json'; // only for comparison
import axios from 'axios';

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

  /* Use axios.get which returns a promise in an observable */

  it('using axios.get create observable from promise', done => {
    // TODO 4b - using axios.get create observable from promise
    // TODO use axios.get to fetch /fake-api.json
    const prom4b = axios.get('/fake-api.json');

    const ob4$ = from(prom4b);

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
      }
    ];
    const found = [];
    ob4$
      .pipe(
        map(x => x.data)
      )
      .subscribe({
        next: x => found.push(x),
        error: err => done(err),
        complete: () => {
          expect(found).toEqual(expected);
          done();
        }
      });
  });


  it('filter values to only those < 25', done => {
    // TODO 5
    const ob1a$ = of(10, 20, 30, 40)
      .pipe(
        filter(x => x < 25)
      );

    const expected = [10, 20];
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

  it('filter values to only those > 20 and multiply each by 10', done => {
    // TODO 6
    const ob1a$ = of(10, 20, 30, 40)
      .pipe(
        filter(x => x > 20),
        map(x => x * 10)
      );

    const expected = [300, 400];
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


  it('find the sum of all values < 40', done => {
    // TODO 7
    const ob1a$ = of(10, 20, 30, 40)
      .pipe(
        filter(x => x < 40),
        reduce((acc, x) => acc + x, 0)
      );

    const expected = [60];
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

  it('iterate over all values in an array using observable', done => {
    // TODO 8
    const arr = [10, 20, 30, 40];
    const ob1a$ = from(arr);

    const expected = [10, 20, 30, 40];
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

  it('send array as the only value in an observable', done => {
    // TODO 9
    const arr = [10, 20, 30, 40];
    const ob1a$ = of(arr);

    const expected = [[10, 20, 30, 40]];
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






});


mocha.run();
