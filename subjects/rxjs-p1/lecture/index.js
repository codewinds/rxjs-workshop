import '../util/polyfill'; // first import polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, timestamp, filter, map, mergeMap, retryWhen, switchMap, tap, reduce, scan } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';

/* https://rxjs-dev.firebaseapp.com/api */

// locate a div in our html where we want to render
const appContainerDiv = document.querySelector('#appContainer');
const topic = jsx => ReactDOM.render(jsx, appContainerDiv);

/* Imperative code with mutations */

// topic('Imperative code with mutations');
// const arr = [1, 2, 3];
// function applyFactor(arr) {
//   for(let i = 0; i < arr.length; i++) {
//     arr[i] *= 10;
//   }
//   return arr;
// }
// const resultArr = applyFactor(arr);
// console.log('result', resultArr);

// /* later we decide to report on the delta */
// for(let i = 0; i<resultArr.length; i++) {
//   console.log("delta", i, resultArr[i] - arr[i]);
// }

/* array map, forEach */

// topic('array map, forEach');
// const arr = [1, 2, 3];
// function applyFactor(arr) {
//   return arr.map(x => x * 10);
// }
// const resultArr = applyFactor(arr);
// console.log('result', resultArr);
//
// resultArr.forEach((x, i) =>
//   console.log("delta", i, x - arr[i]));

/* array filter, reduce */

// topic('array filter, reduce')
// const arr = [1, 2, 3, 4];
// const sumOdd = arr
//   .filter(x => x % 2)
//   .reduce((acc, x) => acc + x, 0);
// console.log("sumOdd", arr, sumOdd);

/* Promises */

// topic('Promises')
// const prom = new Promise((resolve, reject) => {
//   /* do some stuff */
//   resolve(10);
// });
// prom
//   .then(x => x + 1)
//   .then(x => console.log(x));

/* Promises catch */

// topic('Promises - catch')
// const errProm = new Promise((resolve, reject) => {
//   /* do some stuff that errors */
//   reject(new Error('bad'));
// });
// errProm
//   .then(x => console.log('does not go here', x))
//   .catch(err => {
//     console.log('caught err', err);
//     return 'recoveredValue';
//   })
//   .then(x => console.log('after catch', x));

/* What is an observable? */
// topic('The big idea: what if we could do the same map, filter, reduce on values delivered over time?');

/* Observable.create */

// topic('Observable.create');
// const ob$ = Observable.create(obs => {
//   obs.next('foo');
//   obs.next('bar');
//   obs.next('baz');
//   obs.complete();
// });
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });
//
// const ob2$ = Observable.create(obs => {
//   obs.next('foo');
//   obs.error(new Error('my error'));
// });
//
// /* can subscribe with 3 fns instead of object */
// ob2$.subscribe(
//   x => console.log('ob2$ next', x), /* next */
//   err => console.log('ob2$ error', err), /* error */
//   () => console.log('ob2$ complete') /* complete */
// );


/* Observable of */

// topic('of');
// const ob$ = of('foo', 'bar');
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* Observable throwError */

// topic('throwError');
// const ob$ = throwError(new Error('my error'));
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });

/* ob$.forEach */

// topic('ob$.forEach');
// of(10, 20, 30)
//   .forEach(x => console.log(x));

/* ob$.toPromise */

// topic('ob$.toPromise');
// of(10, 20, 30)
//   .toPromise()
//   .then(x => console.log(x));

/* ob$.pipe, tap */

// topic('ob$.pipe, tap');
// of(10, 20, 30)
//   .pipe(
//     tap(x => console.log(x))
//   )
//   .subscribe();

// topic('ob$.pipe, tap');
// of(10, 20, 30)
//   .pipe(
//     tap(x => console.log(x))
//   )
//   .subscribe();

// topic('ob$.pipe, tap, filter, map');
// of(10, 20, 30, 40)
//   .pipe(
//     tap(x => console.log(x)),
//     filter(x => x > 20),
//     map(x => x * 10),
//     tap(x => console.log('after filter & map', x))
//   )
//   .subscribe();

// topic('reduce');
// of(10, 20, 30)
//   .pipe(
//     reduce((acc, x) => acc + x, 0)
//   )
//   .subscribe(x => console.log(x));

// topic('scan');
// of(10, 20, 30)
//   .pipe(
//     scan((acc, x) => acc + x, 0)
//   )
//   .subscribe(x => console.log(x));

// topic('catchError');
// throwError(new Error('my error'))
//   .pipe(
//     catchError(err => of('recoveredValue'))
//   )
//   .subscribe(
//     x => console.log('next', x),
//     err => console.log('err', err),
//     () => console.log('complete')
//   );

/* Observable from(arr | promise | iterable | obs) */

// topic('from(arr, promise, iterable, obs)');
// from([10, 20, 30])
//   .subscribe({
//     next: x => console.log('arr-next', x),
//     error: err => console.log('arr-error', err),
//     complete: () => console.log('arr-complete')
//   });
//
// const prom = new Promise((resolve, reject) => {
//   resolve('foo');
//   /* or reject(new Error('my error')) */
// });
// from(prom)
//   .subscribe({
//     next: x => console.log('prom-next', x),
//     error: err => console.log('prom-error', err),
//     complete: () => console.log('prom-complete')
//   });
//
// const ob$ = of(10, 20, 30)
//   .pipe(
//     map(x => x * 10)
//   );
//
// from(ob$)
//   .subscribe({
//     next: x => console.log('ob$-next', x),
//     error: err => console.log('ob$-error', err),
//     complete: () => console.log('ob$-complete')
//   });

// topic('What is the difference between from(arr) and of(arr)?');
// from([10, 20, 30])
//   .subscribe(
//     x => console.log('from-next', x),
//     err => console.log('from-err', x),
//     () => console.log('from-complete')
//   );
//
// of([10, 20, 30])
//   .subscribe(
//     x => console.log('of-next', x),
//     err => console.log('of-err', x),
//     () => console.log('of-complete')
//   );
