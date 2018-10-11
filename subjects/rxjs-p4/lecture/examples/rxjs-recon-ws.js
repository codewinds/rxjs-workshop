import { interval, timer } from 'rxjs';
import { retryWhen, tap, switchMap } from 'rxjs/operators';
import { webSocket } from 'rxjs/websocket';

document.querySelector('#appContainer').innerHTML =
  `<h2>rxjs-recon-ws</h2>
   see console and network devtools`;

const wsSubject = webSocket({
  url: 'ws://localhost:8010',
  // WebSocketCtor: WebSocket, // only for Node.js, import WebSocket from 'ws';
  resultSelector: x => x.data  // default is JSON.parse(x.data)
});

const reconWS$ = wsSubject
  .pipe(
    retryWhen(errors =>
      errors
        .pipe(
          tap(err => console.error(err)),
          switchMap(err => timer(1000))
        )
    )
  );

wsSubject.next('foo'); // queue foo for sending
wsSubject.next('bar'); // queue bar for sending

// connect to websocket, send queued msgs, listen for responses
reconWS$.subscribe(
  x => console.log('received', x),
  err => console.error('error', err),
  () => console.log('done')
);

interval(1000)
  .pipe(
    tap(() => wsSubject.next(`time: ${Date.now()}`))
  )
  .subscribe();
