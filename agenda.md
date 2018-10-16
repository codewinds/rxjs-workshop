# RxJS Workshop

## Part 1

 - Imperative code with mutations
 - array map, filter, reduce, forEach
 - Promises
 - What is an observable?
 - Observable.create
 - of
 - throwError
 - forEach, toPromise, pipe
 - Operator tap
 - Operators map, filter, reduce, scan, catchError
 - from value, array, promise, obs, iterable
   - mention difference between from(arr) and of(arr)
 - Exercise: axios or fetch returns promise, can convert into observable

## Part 2

 - Marble Notation
 - RxJS 4, 5, 6 - Recognizing version from the code and adapting
 - Other ways to create observables
   - never
   - empty
   - timer
   - interval
   - range
   - pairs(obj)
   - iif
   - operators startsWith, defaultIfEmpty
   - defer
   - Subject
     - BehaviorSubject
     - ReplaySubject
 - Hot / Cold Observables
   - publish, connect
   - share
 - binding callbacks
   - bindCallback
   - bindNodeCallback
 - events
   - fromEvent (dom, nodejs, jquery targets)
 - aggregation
   - reduce, scan
   - min, max
   - count
   - every
   - sequenceEqual
   - toArray
 - Exercises
   - mouse moves
   - display the max x, y
   - display the formatted current time every second
   - button click - uses fetch or axios to get data and output it


## Part 3

 - filtering
   - filter
   - find
   - findIndex
   - distinct
   - distinctUntilChanged
   - distinctUntilKeyChanged
   - first
   - last
   - elementAt
   - take
   - takeWhile
   - takeUntil
   - takeLast
   - skip
   - skipWhile
   - skipUntil
   - skipLast
 - ajax
 - time / sequence / combination
   - timeout, timeoutWith
   - retry, retryWhen
   - repeat
   - concat
   - merge
   - forkJoin
   - zip
   - combineLatest
   - withLatestFrom
   - debounce, debounceTime
   - throttle, throttleTime
   - audit, auditTime
   - sample, sampleTime
   - delay, delayWhen
   - race
   - mergeMap, concatMap, switchMap
 - grouping
   - groupBy
   - window, windowTime, windowCount, windowWhen, windowToggle
   - buffer, bufferTime, bufferCount, bufferWhen, bufferToggle
 - Exercises
   - button click use ajax to fetch
   - button click use ajax to fetch with timeout x
   - multiple button click to fetch url until another button click cancels and causes different fetch

## Part 4

 - webSocket send/receive
 - Creating custom operators
   - subscribe / create
   - composing with existing ones
 - Testing
   - testScheduler.run(cb)
 - Integration
   - React
   - Vue
   - Angular
