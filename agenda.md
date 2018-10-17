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
   - operators startWith, defaultIfEmpty
   - defer
   - Subject
     - BehaviorSubject
     - ReplaySubject
 - Hot / Cold Observables
   - publish, connect
   - share, shareReplay
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

## Part 3

 - filtering
   - filter
   - find
   - findIndex
   - first
   - last
   - elementAt
   - distinct
   - distinctUntilChanged
   - distinctUntilKeyChanged
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
   - timeStamp
   - timeInterval
   - timeout, timeoutWith
   - retry, retryWhen
   - repeat
   - debounce, debounceTime
   - throttle, throttleTime
   - audit, auditTime
   - sample, sampleTime
   - delay, delayWhen
   - withLatestFrom
   - concat
   - merge
   - forkJoin
   - zip
   - combineLatest
   - race
   - mergeMap, concatMap, switchMap
 - grouping
   - groupBy
   - buffer, bufferTime, bufferCount, bufferWhen, bufferToggle

## Part 4

 - webSocket send/receive
 - Creating custom operators
   - subscribe / create
   - composing with existing ones
 - Integration
   - React
   - Vue
   - Angular
