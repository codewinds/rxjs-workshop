import '../util/polyfill'; // first import polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subject, combineLatest, from, interval, merge, of, throwError, timer, range } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, timestamp, filter, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';

/* https://rxjs-dev.firebaseapp.com/api */
/* https://www.learnrxjs.io/ */

// locate a div in our html where we want to render
const appContainerDiv = document.querySelector('#appContainer');
const topic = jsx => { ReactDOM.render(jsx, appContainerDiv) };

// use for subscriptions to output results
const createOutputObj = (topic) => {
  return {
    next: x => console.log(`${topic}-next`, x),
    error: err => console.log(`${topic}-error`, err),
    complete: () => console.log(`${topic}-complete`)
  };
};

// topic('webSocket-simple send/receive');
// import './examples/rxjs-simple-ws';

// topic('reconnecting websocket send/receive');
// import './examples/rxjs-recon-ws';

/* https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md */
/* an operator that takes every Nth value  */
// topic('custom operator - long');
//
// const takeEveryNth = n => source$ =>
//   Observable.create(obs => {
//     let count = 0;
//     return source$.subscribe({
//       next(x) {
//         if (count % n === 0) {
//           obs.next(x);
//         }
//         count += 1;
//       },
//       error(err) { obs.error(err); },
//       complete() { obs.complete(); }
//     });
//   });
//
// range(0, 30)
//   .pipe(
//     takeEveryNth(3)
//   )
//   .subscribe(createOutputObj('custom-long'));


// topic('custom operator - medium');
//
// const takeEveryNth = n => source$ =>
//   source$.pipe(filter((value, index) => index % n === 0 ));
//
// range(0, 30)
//   .pipe(
//     takeEveryNth(3)
//   )
//   .subscribe(createOutputObj('custom-medium'));


// topic('custom operator - short');
//
// const takeEveryNth = n => filter((x, i) => i % n === 0);
//
// range(0, 30)
//   .pipe(
//     takeEveryNth(3)
//   )
//   .subscribe(createOutputObj('custom-short'));



/* redux-observable http://redux-observable.js.org/ */
// import './examples/redux-observable';


/* redux-logic ajax search https://github.com/jeffbski/redux-logic */
// import './examples/redux-logic-ajax-search';


/* redux-logic ajax search w/processOptions */
// import './examples/redux-logic-ajax-search-process-options';


/* redux-logic reconnecting websocket */
// import './examples/redux-logic-rx-websocket';
