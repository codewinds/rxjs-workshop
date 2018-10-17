import '../util/polyfill'; // first import polyfills
import expect from 'expect-legacy';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer, EMPTY, range, pairs } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, filter, map, mergeMap, retryWhen, switchMap, tap, min, toArray } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';
import FAKE_API_JSON from '../../../public/fake-api.json'; // only for comparison

Error.stackTraceLimit = 3; // limit size of stack trace in chrome



describe('rxjs', () => {

  it('create empty observable', done => {
    // TODO 1 create empty observable, no values, but does complete
    const ob5$ = null; // TODO replace this with empty observable

    const expected = [];
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

  it('create timer observable that emits "abc" after 1s', done => {
    // TODO 2
    const ob5$ = null; // TODO replace this

    const expected = ['abc'];
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

  it('create range observable with values from 0-9', done => {
    // TODO 4
    const ob5$ = null; // TODO replace this

    const expected = [0,1,2,3,4,5,6,7,8,9];
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


  /* Using any observable methods and piping operators */

  it('obs emits every 0.1s, only 5 times, filters odd, multi by 100', done => {
    // TODO 5 create observable incr every 0.1 seconds start with 0
    // TODO 5b and stops emitting after 5 values
    // TODO 5c and filters out odd values
    // TODO 5d and multiplies value by 100
    const ob5$ = null; // TODO replace this

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

  it('iterate over all key values in an obj and output as array pairs', done => {
    // TODO 6
    const obj = {
      a: 10,
      b: 20,
      c: 30
    };
    const ob5$ = null; // TODO replace this

    const expected = [['a', 10], ['b', 20], ['c', 30]];
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

  it('use a subject to create an observable that emits 10, 20, 30 and completes', done => {
    // TODO 7, note scroll down to find START
    const sub$ = new Subject();

    const expected = [10, 20, 30];
    const found = [];

    sub$.subscribe({
      next: x => found.push(x),
      error: err => done(err),
      complete: () => {
        expect(found).toEqual(expected);
        done();
      }
    });

      /* emit 10, 20, 30 on subject and complete */
  });

  it('find the min value from an observable', done => {
    // TODO 8
    const ob5$ = of(10, 20, 30)
      .pipe(
        // TODO find min value
      );

    const expected = [10];
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

  it('convert all obs values to an array in an observable pipe', done => {
    // TODO 9
    const ob5$ = of(10, 20, 30)
      .pipe(
        // TODO convert to an array
      );

    const expected = [[10, 20, 30]];
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





});


mocha.run();
