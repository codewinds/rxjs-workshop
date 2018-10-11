export default {
  'Observable.create': {
    name: 'Observable.create',
    code: `
const { Observable } = Rx;

Rx.Observable.create(obs => {
  obs.next(10); // send first value
  obs.next(20); // 2nd
  obs.next(30); // 3rd
  obs.complete(); // we are done
});
`,
    timeWindow: 5000
  },

  'Observable.create-error': {
    name: 'Observable.create w/err',
    code: `
const { Observable } = Rx;

Observable.create(obs => {
  obs.next(10); // send first value
  obs.next(20); // 2nd
  obs.error(new Error('something bad'));
});
`,
    timeWindow: 5000
  },

  of: {
    name: 'of',
    code: `
const { of } = Rx;

// emits two values: foo, bar and then
of('foo', 'bar');
`,
    timeWindow: 5000
  },

  'ob$.tap': {
    name: 'ob$.tap',
    code: `
const { of } = Rx;
const { tap } = RxOperators;

of('foo', 'bar')
  .pipe(
    tap(
      x => console.log(x),
      err => console.error(err),
      () => console.log('complete')
    )
  );
`,
    timeWindow: 5000
  },

  throwError: {
    name: 'throwError',
    code: `
const { throwError } = Rx;

throw(new Error('my error'));
`,
    timeWindow: 5000
  },

  from: {
    name: 'from',
    code: `
const { from } = Rx;

const prom = new Promise((resolve, reject) => {
  resolve('foo');
  /* or reject(new Error('my error')) */
});

from(prom);
`,
    timeWindow: 5000
  },

  interval: {
    name: 'interval',
    code: `
const { interval } = Rx;

interval(1000);
`,
    timeWindow: 5000
  },

  'timer-single': {
    name: 'timer - single',
    code: `
const { timer } = Rx;

// when is delay in ms or absolute Date
const when = 1000; // ms
timer(when);
`,
    timeWindow: 5000
  },

  'timer-multiple': {
    name: 'timer - multiple',
    code: `
const { timer } = Rx;

// delay and delayBetween in ms
// repeats every delayBetween milliseconds
const delay = 1000; // ms
const delayBetween = 200; // ms
timer(delay, delayBetween);
`,
    timeWindow: 5000
  },

  'ob$.timestamp': {
    name: 'ob$.timestamp',
    code: `
const { interval } = Rx;
const { timestamp, tap } = RxOperators;
interval(1000)
  .pipe(
    timestamp(),
    tap(x => console.log(x))
  );
`,
    timeWindow: 5000
  },

  'ob$.take': {
    name: 'ob$.take',
    code: `
const { interval } = Rx;
const { take } = RxOperators;
interval(1000)
  .pipe(
    take(2)
  );
`,
    timeWindow: 5000
  },

  'ob$.debounceTime': {
    name: 'ob$.debounceTime',
    code: `
const { interval } = Rx;
const { take, debounceTime } = RxOperators;

interval(100)
  .pipe(
    take(5),
    debounceTime(200)
  );
`,
    timeWindow: 5000
  },

  'ob$.throttleTime': {
    name: 'ob$.throttleTime',
    code: `
const { interval } = Rx;
const { take, throttleTime } = RxOperators;
interval(100)
  .pipe(
    take(5),
    throttleTime(200)
  );
`,
    timeWindow: 5000
  },

  'ob$.filter': {
    name: 'ob$.filter',
    code: `
const { interval } = Rx;
const { take, filter } = RxOperators;

interval(1000)
  .pipe(
    take(5),
    filter(x => x % 2)
  );
`,
    timeWindow: 5000
  },

  'ob$.map': {
    name: 'ob$.map',
    code: `
const { interval } = Rx;
const { take, map } = RxOperators;
interval(1000)
  .pipe(
    take(5),
    map(x => \`\${x} banana\`)
  );
`,
    timeWindow: 5000
  },

  piping: {
    name: 'piping',
    code: `
const { interval } = Rx;
const { take, filter, map } = RxOperators;

interval(1000)
  .pipe(
    take(5),
    filter(x => x % 2),
    map(x => \`\${x} banana\`)
  );
`,
    timeWindow: 5000
  },

  merge: {
    name: 'merge',
    code: `
const { merge, interval } = Rx;
const { map } = RxOperators;

merge(
  interval(2000)
    .pipe(
      map(x => 'S' + x)
    ),
  interval(1200)
);
`,
    timeWindow: 5000
  },

  combineLatest: {
    name: 'combineLatest',
    code: `
const { combineLatest, interval } = Rx;
const { map } = RxOperators;

const a$ = interval(2000).pipe(map(x => \`S\${x}\`));
const b$ = interval(1200);
combineLatest(
  a$,
  b$,
  (a, b) => ({
    a: a,
    b: b
  })
);
`,
    timeWindow: 5000
  },

  'ob$.catchError': {
    name: 'ob$.catchError',
    code: `
const { throwError, of } = Rx;
const { catchError, tap } = RxOperators;

throwError(new Error('my error'))
  .pipe(
    catchError(err => of({ type: 'UNCAUGHT',
      payload: err,
      error: true
    })),
    tap(x => console.log(x))
  );
`,
    timeWindow: 5000
  },

  ajax: {
    name: 'ajax',
    code: `
const { ajax } = RxAjax;
const { map, tap } = RxOperators;
ajax.getJSON('https://reqres.in/api/users')
  .pipe(
    map(payload => payload.data), /* use data prop */
    tap(x => console.log(JSON.stringify(x, null, 2)))
  );
`,
    timeWindow: 5000
  },

  'ob$.mergeMap': {
    name: 'ob$.mergeMap',
    code: `
const { of } = Rx;
const { ajax } = RxAjax;
const { map, tap, mergeMap } = RxOperators;

of('redux', 'rxjs')
  .pipe(
    mergeMap(x => ajax({
      url: \`https:npmsearch.com/query?q=\${x}&fields=name,description\`,
      crossDomain: true,
      responseType: 'json'
    })),
    map(ret => ret.response.results),  /* use results prop of payload */
    tap(x => console.log(JSON.stringify(x, null, 2)))
  );
`,
    timeWindow: 5000
  },

  Subject: {
    name: 'Subject',
    code: `
const { Subject } = Rx;

const sub$ = new Subject();
sub$.next(10);

sub$.subscribe({
  next: x => console.log('next', x),
  error: err => console.log('error', err),
  complete: () => console.log('complete')
});

sub$.next(20);
sub$.next(30);
sub$.complete();
sub$;
`,
    timeWindow: 5000
  },

  webSocket: {
    name: 'webSocket',
    code: `
const { webSocket } = RxWebsocket;

const wsSubject = webSocket({
  // url: 'ws://localhost:8010',
  url: 'wss://echo.websocket.org',
  // WebSocketCtor: WebSocket, // only for Node.js, import WebSocket from 'ws';
  resultSelector: x => x.data  // default is JSON.parse(x.data)
});

wsSubject.next('foo'); // queue foo for sending
wsSubject.next('bar'); // queue bar for sending

// later continue sending more data
setInterval(() => wsSubject.next(Date.now()), 2000);

// connect to websocket, send queued msgs, listen for responses
wsSubject;
`,
    timeWindow: 5000
  },

  'reconn-ws': {
    name: 'Reconnecting WS',
    code: `
const { webSocket } = RxWebsocket;
const { timer } = Rx;
const { retryWhen, tap, switchMap } = RxOperators;

const wsSubject = webSocket({
  // url: 'ws://localhost:8010',
  url: 'wss://echo.websocket.org',
  // WebSocketCtor: WebSocket, // only for Node.js, import WebSocket from 'ws';
  resultSelector: x => x.data  // default is JSON.parse(x.data)
});

const reconWS$ = wsSubject
  .pipe(
    retryWhen(errors =>
      errors
        .pipe(
           tap(err => console.error(err))
        )
    ),
    switchMap(err => timer(1000))
  );

setInterval(() => wsSubject.next(Date.now()), 2000);

// connect to websocket, send msgs, listen for responses
reconWS$;
`,
    timeWindow: 50000
  },

  'basic-interval': {
    name: 'Basic interval',
    code: `
const { interval } = Rx;
const { take } = RxOperators;

interval(1000).pipe(
  take(4)
)
`,
    timeWindow: 5000
  },
  'random-error': {
    name: 'Random error',
    code: `
const { Observable } = Rx;

Observable.create(observer => {
  let n = 1;

  const intervalId = setInterval(() => {
    if (Math.random() < 0.8 && n < 9) {
      observer.next(n * n);
      n += 1;
    } else {
      observer.error('Oh no...');
    }
  }, 1000);

  return () => clearInterval(intervalId);
})
`,
    timeWindow: 10000
  },
  'chess-game': {
    name: 'Chess game',
    code: `
const { of, interval } = Rx;
const { zip, map } = RxOperators;

const timer$ = interval(1000);
const pieces$ = of('', '♞', '', '♞', '♘', '♞');
const columns$ = of('e', 'c', 'g', 'd', 'e', 'f');
const rows$ = of('4', '6', '4', '4', '2', '3');

timer$.pipe(
  zip(
    pieces$,
    columns$,
    rows$
  ),
  map(([_, piece, column, row]) => \`\${piece}\${column}\${row}\`)
)
`,
    timeWindow: 7000
  },
  'higher-order-observable': {
    name: 'Higher order Observable',
    code: `
const { interval } = Rx;
const { groupBy } = RxOperators;

interval(1000).pipe(
  groupBy(n => n % 2)
)
`,
    timeWindow: 10000
  },
  'grouped-fibonacci': {
    name: 'Grouped Fibonacci',
    code: `
const { interval } = Rx;
const { scan, pluck, groupBy } = RxOperators;

interval(1000).pipe(
  scan(
    ({ secondLast, last }) => ({
      secondLast: last,
      last: last + secondLast
    }),
    { secondLast: 0, last: 1 }
  ),
  pluck("secondLast"),
  groupBy(n => Math.floor(Math.log10(n)))
)

`,
    timeWindow: 15000
  },
  'today-is': {
    name: 'Today is...',
    code: `
const { of, interval, range, EMPTY } = Rx;
const { delay, take, map, concatMap } = RxOperators;

const sentence = new Date().toString().toUpperCase();
const words = sentence.split(' ');
const delayMS = 1000;

const wordDelay = i =>
  i === 0
    ? delayMS
    : (words[i - 1].length + 1) * delayMS;

const wordStart = i =>
  i < words.length
    ? of(i).pipe(delay(wordDelay(i)))
    : EMPTY.pipe(delay(wordDelay(i)))

const wordObservable = word => {
  const letters = word.split('');

  return interval(delayMS).pipe(
    take(letters.length),
    map(i => letters[i])
  );
};

range(0, words.length + 1).pipe(
  concatMap(wordStart),
  map(i => wordObservable(words[i]))
)
`,
    timeWindow: 17000
  },
  'custom-operator': {
    name: 'Custom operator',
    code: `
const { Observable, interval } = Rx;

const sqrt = source$ => Observable.create(observer =>
  source$.subscribe(
    value => {
      const result = Math.sqrt(value);

      if (typeof value !== 'number' || isNaN(result)) {
        observer.error(\`Square root of \${value} doesn't exist\`);
      } else {
        observer.next(result);
      }
    },
    err => observer.error(err),
    () => observer.complete()
  )
);

interval(1000).pipe(sqrt)

`,
    timeWindow: 12000
  },
  'mouse-move': {
    name: 'Mouse move',
    code: `
const { fromEvent } = Rx;
const { map, throttleTime } = RxOperators;

fromEvent(document, 'mousemove').pipe(
  map(event => event.clientX),
  throttleTime(300)
)

// Move your mouse over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 10000
  },
  'input-element': {
    name: 'Input element',
    code: `
const { fromEvent } = Rx;
const { map, filter } = RxOperators;

const input = document.createElement('input');

input.setAttribute('placeholder', 'Type something');

// \`output\` represents the right hand pane.
// You can prepend/append elements to it.
output.prepend(input);

input.focus();

fromEvent(input, 'keydown').pipe(
  map(e => e.key),
  filter(key => key !== ' ')
)
`,
    timeWindow: 20000
  },
  'pause-and-resume': {
    name: 'Pause and resume',
    code: `
const { fromEvent, timer, EMPTY } = Rx;
const { scan, startWith, map, filter, switchMap } = RxOperators;

const pauseResume$ = fromEvent(document, 'click').pipe(
  scan(acc => !acc, true),
  startWith(true)
);
const counter$ = timer(0, 1000);

pauseResume$.pipe(
  switchMap(resume => resume ? counter$ : EMPTY)
)

// Click to pause and resume over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 20000
  },
  custom: {
    name: 'Custom',
    code: `
// Write any JavaScript you want, just make sure that
// the last expression is an Rx.Observable

const {  } = Rx;
const {  } = RxOperators;
 `,
    timeWindow: 10000
  }
};
