import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

let wsProvider: WebsocketProvider;
let isAlreadyConnected = false;
let YDoc: Y.Doc;

const connectToWSAndYDoc = (projectId: string) => {
  if (isAlreadyConnected) {
    wsProvider.destroy();
  }

  YDoc = new Y.Doc();
  wsProvider = new WebsocketProvider(`ws://localhost:8002`, projectId, YDoc);
  wsProvider.on('status', (event: any) => {
    if (event.status === 'connected') {
      isAlreadyConnected = true;
    } else if (event.status === 'disconnected') {
      isAlreadyConnected = false;
    }
  });
};

export const getYDoc = () => YDoc;

export { connectToWSAndYDoc };
