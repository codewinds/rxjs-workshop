import '../util/polyfill'; // first import polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subject, combineLatest, from, interval, merge,
  of, throwError, timer, concat, forkJoin, zip, race, EMPTY, fromEvent } from 'rxjs';
import { catchError, timestamp, filter,
  map, mergeMap, switchMap, tap, find, findIndex, distinct,
  distinctUntilChanged, distinctUntilKeyChanged, first, last, elemantAt,
  take, takeWhile, takeUntil, takeLast, skip, skipWhile, skipUntil,
  skipLast, elementAt, timeout, timeoutWith, retry, retryWhen, repeat,
  debounce, debounceTime, throttle, throttleTime, audit, auditTime,
  sample, sampleTime, delay, delayWhen, withLatestFrom, concatMap,
  timeInterval, groupBy, bufferTime, bufferCount, windowTime, windowCount,
  toArray, reduce
  } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { webSocket } from 'rxjs/webSocket';

/* https://rxjs-dev.firebaseapp.com/api */

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

/* filtering */

// topic('filtering fiter, find, findIndex, first, last, elementAt')
// of(10, 20, 30, 40)
//   .pipe(
//     filter(x => x < 30)
//   )
//   .subscribe(createOutputObj('filter'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     filter(x => x < 30)
//   )
//   .subscribe(createOutputObj('filter'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     filter(x => x < 30)
//   )
//   .subscribe(createOutputObj('filter'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     find(x => x > 20)
//   )
//   .subscribe(createOutputObj('find'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     findIndex(x => x > 20)
//   )
//   .subscribe(createOutputObj('findIndex'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     first()
//   )
//   .subscribe(createOutputObj('first'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     last()
//   )
//   .subscribe(createOutputObj('last'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     elementAt(2)
//   )
//   .subscribe(createOutputObj('elementAt'));


// topic('filtering distinct...');
// of(10, 10, 20, 10, 30, 30, 40)
//   .pipe(
//     distinct()
//   )
//   .subscribe(createOutputObj('distinct'));
//
// of(10, 10, 20, 10, 30, 30, 40)
//   .pipe(
//     distinctUntilChanged()
//   )
//   .subscribe(createOutputObj('distinctUntilChanged'));
//
// of(
//   { name: 'foo', value: 10 },
//   { name: 'foo', value: 20 },
//   { name: 'bar', value: 30 },
//   { name: 'bar', value: 40 },
//   { name: 'foo', value: 50 }
// )
//   .pipe(
//     distinctUntilKeyChanged('name')
//   )
//   .subscribe(createOutputObj('distinctUntilKeyChanged'));

// topic('take, takeWhile, takeUntil, takeLast');
// of(10, 20, 30)
//   .pipe(
//     take(2)
//   )
//   .subscribe(createOutputObj('take'));
//
// of(10, 20, 30, 15)
//   .pipe(
//     takeWhile(x => x < 20)
//   )
//   .subscribe(createOutputObj('takeWhile'));
//
// of(10, 20, 30, 15)
//   .pipe(
//     takeLast(2)
//   )
//   .subscribe(createOutputObj('takeLast'));
//
// const timerOb$ = timer(3000); /* delay 3s */
// interval(1000)
//   .pipe(
//     takeUntil(timerOb$)
//   )
//   .subscribe(createOutputObj('takeUntil'));


// topic('skip, skipWhile, skipUntil, skipLast');
// of(10, 20, 30, 40)
//   .pipe(
//     skip(2)
//   )
//   .subscribe(createOutputObj('skip'));
//
// of(10, 20, 30, 15)
//   .pipe(
//     skipWhile(x => x < 20)
//   )
//   .subscribe(createOutputObj('skipWhile'));
//
// of(10, 20, 30, 15)
//   .pipe(
//     skipLast(2)
//   )
//   .subscribe(createOutputObj('skipLast'));
//
// const timerOb$ = timer(3000); /* delay 3s */
// interval(1000)
//   .pipe(
//     skipUntil(timerOb$)
//   )
//   .subscribe(createOutputObj('skipUntil'));

// topic('ajax');
// const searchKeywords = 'react';
// ajax({
//   url: `https:npmsearch.com/query?q=${searchKeywords}&fields=name,description`,
//   crossDomain: true,
//   /* method: 'POST', */ /* defaults to GET */
//   /* body: { foo: 'bar' }, */
//   responseType: 'json'
// })
//   .pipe(
//     map(ret => ret.response.results)  /* use results prop of payload */
//   )
//   .subscribe(createOutputObj('ajax'));

/* time, sequence, combination */

// topic('timestamp');
// interval(100)
//   .pipe(
//     take(3),
//     timestamp()
//   )
//   .subscribe(createOutputObj('timestamp'));

// topic('timeInterval');
// interval(100)
//   .pipe(
//     take(10),
//     timeInterval()
//   )
//   .subscribe(createOutputObj('timeInterval'));


// topic('timeout, timeoutWith');
// timer(3000)
//   .pipe(
//     timeout(2000)
//   )
//   .subscribe(createOutputObj('timeout'));
//
// timer(3000)
//   .pipe(
//     timeoutWith(2000, of(10, 20, 30)) /* could use cached */
//   )
//   .subscribe(createOutputObj('timeoutWith'));

// topic('retry, retryWhen');
// Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.error(new Error('my error'));
// })
//   .pipe(
//     retry(3)
//   )
//   .subscribe(createOutputObj('retry'));
//
// Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.error(new Error('my error'));
// })
//   .pipe(
//     retryWhen(err => EMPTY)
//     /* retryWhen(err => throwError('error now')) */
//     /* retryWhen(err => of(1)) */
//   )
//   .subscribe(createOutputObj('retryWhen'));

// topic('repeat')
// of(10, 20, 30)
//   .pipe(
//     repeat(2)
//   )
//   .subscribe(createOutputObj('repeat'));

// topic('debounceTime');
// fromEvent(document, 'mousemove')
//   .pipe(
//     debounceTime(100) /* ms */
//   )
//   .subscribe(createOutputObj('debounceTime'));

// topic('debounce');
// fromEvent(document, 'mousemove')
//   .pipe(
//     debounce(x => timer(100))
//   )
//   .subscribe(createOutputObj('debounce'));

// topic('throttleTime');
// fromEvent(document, 'click')
//   .pipe(
//     throttleTime(1000) /* ms */
//   )
//   .subscribe(createOutputObj('throttleTime'));

// topic('throttle');
// fromEvent(document, 'click')
//   .pipe(
//     throttle(x => timer(1000))
//   )
//   .subscribe(createOutputObj('throttle'));

/* auditTime, audit are like throttleTime, throttle except uses last value */
// topic('auditTime');
// fromEvent(document, 'mousemove')
//   .pipe(
//     auditTime(100) /* ms */
//   )
//   .subscribe(createOutputObj('auditTime'));

// topic('audit');
// fromEvent(document, 'mousemove')
//   .pipe(
//     audit(x => timer(100))
//   )
//   .subscribe(createOutputObj('audit'));

// topic('sampleTime');
// fromEvent(document, 'mousemove')
//   .pipe(
//     sampleTime(100) /* ms */
//   )
//   .subscribe(createOutputObj('sampleTime'));


// topic('sample');
// fromEvent(document, 'mousemove')
//   .pipe(
//     sample(
//       interval(100) /* ms */
//         .pipe(
//           take(10)
//         )
//     )
//   )
//   .subscribe(createOutputObj('sample'));

// topic('delay');
// console.log('starting');
// of(10, 20, 30)
//   .pipe(
//     delay(3000)
//   )
//   .subscribe(createOutputObj('delay'));

// topic('delayWhen');
// console.log('starting');
// of(10, 20, 30)
//   .pipe(
//     delayWhen((x, i) => interval(Math.random() * 2000))
//   )
//   .subscribe(createOutputObj('delayWhen'));

// topic('withLatestFrom');
// const int$ = interval(100);
// interval(1000)
//   .pipe(
//     withLatestFrom(int$)
//   )
//   .subscribe(createOutputObj('withLatestFrom'));

// topic('concat');
// concat(
//   of(10, 20, 30),
//   of('a', 'b', 'c')
// )
//   .subscribe(createOutputObj('concat'));

// topic('merge');
// merge(
//   interval(1000),
//   interval(3000)
//     .pipe(
//       map(x => `slower-${x}`)
//     )
// )
//   .subscribe(createOutputObj('merge'));

// topic('forkJoin');
// forkJoin(
//   of(10, 20, 30),
//   of('a', 'b', 'c'),
//   interval(100).pipe(take(5))
// )
//   .subscribe(createOutputObj('forkJoin'));

// topic('zip');
// zip(
//   of(10, 20, 30),
//   of('a', 'b', 'c'),
//   interval(100).pipe(take(5))
// )
//   .subscribe(createOutputObj('zip'));

// topic('combineLatest');
// combineLatest(
//   of(10, 20, 30),
//   of('a', 'b', 'c'),
//   interval(100).pipe(take(5))
// )
//   .subscribe(createOutputObj('combineLatest'));

// topic('race');
// race(
//   interval(100).pipe(
//     take(5),
//     map(x => `fast-${x}`)
//   ),
//   interval(1000).pipe(
//     take(5),
//     map(x => `slow-${x}`)
//   )
// )
//   .subscribe(createOutputObj('race'));

// topic('mergeMap-simple');
// of('a', 'b', 'c')
//   .pipe(
//     mergeMap(x =>
//       interval(10)
//         .pipe(
//           take(3),
//           map(i => `${x}-${i}`)
//         )
//     )
//   )
//   .subscribe(createOutputObj('mergeMap-simple'));


// topic('mergeMap-ajax');
// of('react', 'redux', 'js')
//   .pipe(
//     mergeMap(x => ajax({
//       url: `https:npmsearch.com/query?q=${x}&fields=name,description`,
//       crossDomain: true,
//       responseType: 'json'
//     })
//       .pipe(
//         map(ret => ret.response.results),  /* use results prop of payload */
//         map(results => ({
//           search: x,
//           results
//         }))
//       )
//     )
//   )
//   .subscribe(createOutputObj('mergeMap-ajax'));

// topic('concatMap');
// of('a', 'b', 'c')
//   .pipe(
//     concatMap(x =>
//       interval(10)
//         .pipe(
//           take(3),
//           map(i => `${x}-${i}`)
//         )
//     )
//   )
//   .subscribe(createOutputObj('concatMap'));

// topic('switchMap');
// of('react', 'vue', 'angular')
//   .pipe(
//     switchMap(x => ajax({
//       url: `https:npmsearch.com/query?q=${x}&fields=name,description`,
//       crossDomain: true,
//       responseType: 'json'
//     })
//       .pipe(
//         map(ret => ret.response.results),  /* use results prop of payload */
//         map(results => ({
//           search: x,
//           results
//         }))
//       )
//     )
//   )
//   .subscribe(createOutputObj('switchMap-ajax'));


// topic('grouping groupBy');
// of(100, 200, 110, 300, 440, 250, 345, 123, 234)
//   .pipe(
//     groupBy(x => Math.floor(x / 100)),
//     mergeMap(group$ => group$.pipe(reduce((acc, x) => [...acc, x], [])))
//   )
//   .subscribe(createOutputObj('groupBy'));

// topic('bufferTime');
// interval(100)
//   .pipe(
//     take(10),
//     bufferTime(250)
//   )
//   .subscribe(createOutputObj('bufferTime'));

// topic('bufferCount');
// interval(100)
//   .pipe(
//     take(10),
//     bufferCount(3)
//   )
//   .subscribe(createOutputObj('bufferCount'));
