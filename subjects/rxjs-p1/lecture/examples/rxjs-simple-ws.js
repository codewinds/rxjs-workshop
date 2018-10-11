import { interval, timer } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/websocket';

document.querySelector('#appContainer').innerHTML =
  `<h2>rxjs-simple-ws</h2>
   see console and network devtools`;

const wsSubject = webSocket({
  url: 'ws://localhost:8010',
  // WebSocketCtor: WebSocket, // only for Node.js, import WebSocket from 'ws';
  resultSelector: x => x.data  // default is JSON.parse(x.data)
});


wsSubject.next('foo'); // queue foo for sending
wsSubject.next('bar'); // queue bar for sending

// connect to websocket, send queued msgs, listen for responses
wsSubject.subscribe(
  x => console.log('received', x),
  err => console.error('error', err),
  () => console.log('done')
);

interval(1000)
  .pipe(
    take(5),
    tap(() => wsSubject.next(`time: ${Date.now()}`))
  )
  .subscribe();

timer(10000)
  .pipe(
    tap(() => wsSubject.complete())
  )
  .subscribe();
