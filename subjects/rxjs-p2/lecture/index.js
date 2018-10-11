import '../util/polyfill'; // first import polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, timestamp, filter, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';

/* https://rxjs-dev.firebaseapp.com/api */

// locate a div in our html where we want to render
const appContainerDiv = document.querySelector('#appContainer');

/* */
ReactDOM.render(
  <div>
  <ul>
  <li>Event Composition</li>
  <li>Data over time</li>
  <li>ReactiveX/RxJS v6</li>
  <ul>
  <li>Better performance</li>
  <li>Modularity</li>
  <li>Debuggable call stacks</li>
  <li>Reduced API size</li>
  </ul>
  </ul>
  </div>,
  appContainerDiv
);


/* Observable.create */

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
// ob2$.subscribe({
//   next: x => console.log('ob2$ next', x),
//   error: err => console.log('ob2$ error', err),
//   complete: () => console.log('ob2$ complete')
// });


/* Observable of */

// const ob$ = of('foo', 'bar');
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* Observable throwError */

// const ob$ = throwError(new Error('my error'));
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* Observable from(arr | promise | obs) */

// const prom = new Promise((resolve, reject) => {
//   resolve('foo');
//   /* or reject(new Error('my error')) */
// });
//
// const ob$ = from(prom);
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });



/* Observable interval */

// const int$ = interval(1000);
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });

/* Observable timer - single event */

/* delay in ms or absolute Date */
// const int$ = timer(1000);
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });

/* Observable timer - multiple event */

/* delay and delayBetween in ms
   repeats every delayBetween milliseconds */
// const delay = 1000;  /* ms */
// const delayBetween = 500;  /* ms */
// const int$ = timer(delay, delayBetween);
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* timestamp */

// const int$ = interval(1000)
//   .pipe(
//     timestamp()
//   );
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* take(N) */

// const int$ = interval(1000)
//   .pipe(
//     take(5)
//   );
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });

/* debounceTime */

// const int$ = interval(100)
//   .pipe(
//     take(5),
//     debounceTime(200)
//   );
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });

/* throttleTime */

// const int$ = interval(100)
//   .pipe(
//     take(10),
//     throttleTime(200)
//   );
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* filter, map */

// const int$ = interval(1000)
//   .pipe(
//     take(5),
//     filter(x => x % 2),
//     map(x => `${x} banana`)
//   );
//
// int$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* Observable merge, throttleTime */

// const ob$ = merge(
//   interval(1000)
//     .pipe(
//       map(x => `${x}s*****`)
//     ),
//   interval(100)
//     .pipe(
//       throttleTime(500)
//     )
// );
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* Observable combineLatest */

// const a$ = interval(1000)
//   .pipe(
//     map(x => `${x}s`)
//   );
//
// const b$ = interval(200);
//
// const ob$ = combineLatest(
//   a$,
//   b$,
//   (a, b) => ({
//     a: a,
//     b: b
//   })
// );
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* catchError */

// const ob$ = throwError(new Error('my error'))
//   .pipe(
//     catchError(err => of({ type: 'UNCAUGHT',
//       payload: err,
//       error: true }))
//   );
//
// ob$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });



/* Observable.ajax */

// const ob$ = ajax.getJSON('/fake-api.json')
//   .pipe(
//     map(payload => payload.items) /* use items prop */
//   );
//
// ob$.subscribe({
//   next: x => console.log('next', JSON.stringify(x, null, 2)),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });


/* mergeMap */

// const ob$ = Observable.create(obs => {
//   obs.next('redux');
//   obs.next('rxjs');
//   obs.complete();
// });
//
// ob$
//   .pipe(
//     mergeMap(x =>
//       ajax({
//         url: `https:npmsearch.com/query?q=${x}&fields=name,description`,
//         crossDomain: true,
//         responseType: 'json'
//       })
//         .pipe(
//           map(ret => ret.response.results)  /* use results prop of payload */
//         )
//     )
//   )
//   .subscribe({
//     next: x => console.log('next', JSON.stringify(x, null, 2)),
//     error: err => console.log('error', err),
//     complete: () => console.log('complete')
//   });



/* Subject */

// const sub$ = new Subject();
// sub$.next(10);
//
// sub$.subscribe({
//   next: x => console.log('next', x),
//   error: err => console.log('error', err),
//   complete: () => console.log('complete')
// });
//
// sub$.next(20);
// sub$.next(30);
// sub$.complete();



/* websocket simple  */
// import './examples/rxjs-simple-ws';

/* reconnecting websocket */
// import './examples/rxjs-recon-ws';


/* redux-observable http://redux-observable.js.org/ */
// import './examples/redux-observable';


/* redux-logic ajax search https://github.com/jeffbski/redux-logic */
// import './examples/redux-logic-ajax-search';


/* redux-logic ajax search w/processOptions */
// import './examples/redux-logic-ajax-search-process-options';


/* redux-logic reconnecting websocket */
// import './examples/redux-logic-rx-websocket';
