import '../util/polyfill'; // first import polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subject, combineLatest, from, interval, merge, of,
  throwError, timer, NEVER, EMPTY, range, pairs, iif, defer,
  BehaviorSubject, ReplaySubject, bindCallback, bindNodeCallback,
  fromEvent } from 'rxjs';
import { catchError, debounceTime, take, throttleTime, timestamp, filter,
  map, mergeMap, retryWhen, switchMap, tap, publish, share, reduce, scan,
  min, max, every, sequenceEqual, toArray, startWith, defaultIfEmpty,
  shareReplay, count
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

// topic('Marble Notation');
/* TODO */

// topic('RxJS Versions');
/* TODO */

/* Other ways to create observables */

// topic('Other ways to create Observables');

// NEVER.subscribe(createOutputObj('NEVER')); /* no output */
// EMPTY.subscribe(createOutputObj('EMPTY'));
//
// const initialDelay = 2000; /* ms */
// timer(initialDelay)
//   .subscribe(createOutputObj('timer-once'));
//
// const period = 1000; /* ms */
// timer(initialDelay, period)
//   .subscribe(createOutputObj('timer-repeats'));

// interval(1000) /* ms */
//   .subscribe(createOutputObj('interval'));

// range(0, 10)
//   .subscribe(createOutputObj('range'));

// const obj = {
//   a: 'one',
//   b: 'two',
//   c: 'three'
// };
// pairs(obj)
//   .subscribe(createOutputObj('pairs'));

// const fn = () => true;
// const a$ = of(1, 2, 3);
// const b$ = of('d', 'e', 'f');
// iif(fn, a$, b$)
//   .subscribe(createOutputObj('iif'));

/* startWith, defaultIfEmpty operators */
// topic('startWith, defaultIfEmpty operators');
// EMPTY
//   .pipe(
//     startWith('hello')
//   )
//   .subscribe(createOutputObj('startWith-empty'));
//
// of(1, 2, 3)
//   .pipe(
//     startWith('hello')
//   )
//   .subscribe(createOutputObj('startWith-123'));
//
// EMPTY
//   .pipe(
//     defaultIfEmpty('I defaulted')
//   )
//   .subscribe(createOutputObj('defaultIfEmpty-empty'));
//
// of(1, 2, 3)
//   .pipe(
//     defaultIfEmpty('I defaulted')
//   )
//   .subscribe(createOutputObj('defaultIfEmpty-123'));

// topic('defer');
// const ob$ = defer(() => {
//   const rand = Math.random() * 100;
//   return of(rand, rand + 1, rand + 2);
// });
//
// ob$.subscribe(createOutputObj('defer-first'));
// ob$.subscribe(createOutputObj('defer-second'));

// topic('Subject');
// const sub1$ = new Subject();
// sub1$.subscribe(createOutputObj('subject'));
// sub1$.next(1);
// sub1$.next(2);
// sub1$.next(3);
// sub1$.complete();
//
// // sub1$.error(new Error('my error'));
//
// sub1$.subscribe(createOutputObj('subject2'));


// topic('Subject-many subscribers');
// const sub1$ = new Subject();
// sub1$.subscribe(createOutputObj('subject1'));
// sub1$.subscribe(createOutputObj('subject2'));
// sub1$.next(1);
// sub1$.next(2);
// sub1$.next(3);
// sub1$.complete();

// topic('BehaviorSubject');
// const sub$ = new BehaviorSubject(10);
// sub$.subscribe(createOutputObj('BehaviorSubject-first-sub'));
// sub$.next(20);
// sub$.next(30);
// sub$.subscribe(createOutputObj('BehaviorSubject-second-sub'));
// sub$.next(40)
// sub$.complete();

// topic('ReplaySubject');
// const sub$ = new ReplaySubject(2);
// sub$.next(10);
// sub$.next(20);
// sub$.next(30);
// sub$.subscribe(createOutputObj('ReplaySubject-first'));
// sub$.next(40);
// sub$.subscribe(createOutputObj('ReplaySubject-second'));
// sub$.next(50);
// sub$.complete();

// topic('ReplaySubject with expire time');
// const expireAfter = 100; /* ms */
// const sub$ = new ReplaySubject(2, expireAfter);
// sub$.next(10);
// sub$.next(20);
// sub$.next(30);
// sub$.subscribe(createOutputObj('ReplaySubject-first'));
// setTimeout(() => {
//   sub$.next(40);
//   sub$.subscribe(createOutputObj('ReplaySubject-second'));
//   sub$.next(50);
//   sub$.complete();
// }, 1000);

// topic('cold observable');
// const ob$ = Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.next(10);
//   obs.next(20);
//   obs.next(30);
//   obs.complete();
// });
// ob$.subscribe(createOutputObj('cold'));
// ob$.subscribe(createOutputObj('cold2'));

// topic('hot observable');
// const sub$ = new Subject();
// sub$.subscribe(createOutputObj('hot'));
// sub$.subscribe(createOutputObj('hot2'));
// sub$.next(10);
// sub$.next(20);
// sub$.subscribe(createOutputObj('hot3'));
// sub$.complete();
// sub$.subscribe(createOutputObj('hot4'));

// topic('cold w/publish = hot');
// const ob$ = Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.next(10);
//   obs.next(20);
//   obs.next(30);
//   obs.complete();
// })
//   .pipe(
//     publish()
//   );
// ob$.subscribe(createOutputObj('hot'));
// ob$.subscribe(createOutputObj('hot2'));
// ob$.connect();

// topic('cold w/share = hot');
// const ob$ = Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.next(10);
//   setTimeout(() => {
//     obs.next(20);
//     obs.next(30);
//     obs.complete();
//   }, 1000);
// })
//   .pipe(
//     share()
//   );
// ob$.subscribe(createOutputObj('hot'));
// ob$.subscribe(createOutputObj('hot2'));

// topic('cold w/shareReplay = hot');
// const ob$ = Observable.create(obs => {
//   console.log('in create', Date.now());
//   obs.next(1);
//   obs.next(2);
//   obs.next(3);
//   setTimeout(() => {
//     obs.next('a');
//     obs.next('b');
//     obs.complete();
//   }, 1000);
// })
//   .pipe(
//     shareReplay(2 /*, optional expireTimeInMS */)
//   );
// ob$.subscribe(createOutputObj('hot'));
// ob$.subscribe(createOutputObj('hot2'));

// topic('bindCallback');
// const fn = (val, cb) => {
//   console.log('in fn', Date.now());
//   /* could do async stuff here */
//   cb({
//     type: 'foo',
//     payload: val
//   });
// };
// const boundFn = bindCallback(fn);
// const ob$ = boundFn('hello');
// ob$.subscribe(createOutputObj('bindCallback'));
// ob$.subscribe(createOutputObj('bindCallback2'));

// topic('bindNodeCallback');
// const fn = (val, cb) => {
//   console.log('in fn', Date.now());
//   /* could do async stuff here */
//   const err = null;
//   cb(err, {
//     type: 'foo',
//     payload: val
//   });
// };
// const boundFn = bindNodeCallback(fn);
// const ob$ = boundFn('hello');
// ob$.subscribe(createOutputObj('bindCallback'));
// ob$.subscribe(createOutputObj('bindCallback2'));

// topic('bindNodeCallback erroring');
// const fn = (val, cb) => {
//   console.log('in fn', Date.now());
//   /* could do async stuff here */
//   const err = new Error('my error');
//   cb(err);
// };
// const boundFn = bindNodeCallback(fn);
// const ob$ = boundFn('hello');
// ob$.subscribe(createOutputObj('bindCallback-err'));
// ob$.subscribe(createOutputObj('bindCallback-err2'));

// topic('fromEvent');
// fromEvent(document, 'click')
//   .subscribe(createOutputObj('fromEvent-click'));
// fromEvent(document, 'mousemove')
//   .subscribe(createOutputObj('fromEvent-mousemove'));

/* aggregation */

// topic('aggregation with reduce, scan');
// of(10, 20, 30)
//   .pipe(
//     reduce((acc, x) => acc + x, 0)
//   )
//   .subscribe(createOutputObj('reduce'));
//
// of(10, 20, 30)
//   .pipe(
//     scan((acc, x) => acc + x, 0)
//   )
//   .subscribe(createOutputObj('scan'));

// topic('aggregation min, max, count');
// of(20, 10, 30, 15)
//   .pipe(
//     min()
//   )
//   .subscribe(createOutputObj('min'));
//
// of(20, 10, 30, 15)
//   .pipe(
//     max()
//   )
//   .subscribe(createOutputObj('max'));
//
// of(20, 10, 30, 15)
//   .pipe(
//     count()
//   )
//   .subscribe(createOutputObj('count'));

// topic('every');
// of(10, 20, 30)
//   .pipe(
//     every(x => x < 20)
//   )
//   .subscribe(createOutputObj('every x < 20'));
//
// of(10, 20, 30)
//   .pipe(
//     every(x => x < 100)
//   )
//   .subscribe(createOutputObj('every x < 100'));

// topic('sequenceEqual');
// const ob1$ = of(10, 20, 30);
// of(10, 20, 30)
//   .pipe(
//     sequenceEqual(ob1$)
//   )
//   .subscribe(createOutputObj('sequenceEqual'));
//
// of(10, 20, 30, 40)
//   .pipe(
//     sequenceEqual(ob1$)
//   )
//   .subscribe(createOutputObj('sequenceEqual2'));

// topic('toArray operator')
// of(10, 20, 30)
//   .pipe(
//     toArray()
//   )
//   .subscribe(createOutputObj('toArray'));
