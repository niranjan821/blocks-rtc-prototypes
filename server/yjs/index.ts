import http from 'http';
import WebSocket from 'ws';
import * as Y from 'yjs';
import { MongodbPersistence } from 'y-mongodb';
const utils = require('./utils.js');


const location = process.env.MONGODB_URI || 'mongodb://localhost:27017/yjs-prototype';
const collection = 'yjs-transactions';
const ldb = new MongodbPersistence(location, collection);

const production = process.env.PRODUCTION != null;
const port = process.env.PORT || 8002;


const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('okay');
});


// const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({  noServer: true });

wss.on('connection', utils.setupWSConnection);
server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
});

/*
 Persistence must have the following signature:
{ bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise }
*/
utils.setPersistence({
  bindState: async (docName: any, ydoc: any) => {
    // console.log('bindState', docName, ydoc)
    // Here you listen to granular document updates and store them in the database
    // You don't have to do this, but it ensures that you don't lose content when the server crashes
    // See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode 
    // document updates
    const persistedYdoc = await ldb.getYDoc(docName);
    try {
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates)
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    } catch (error) {
      console.log("Document not found in mongodb");
    }
    ydoc.on('update', async (update: any) => {
      console.log(update);
      console.log("updating in mongodb")
      ldb.storeUpdate(docName, update);
    })
  },
  writeState: async (docName: any, ydoc: any) => {
    console.log('writeState', docName, ydoc)
    // This is called when all connections to the document are closed.
    // In the future, this method might also be called in intervals or after a certain number of updates.
    return new Promise<void>(resolve => {
      // When the returned Promise resolves, the document will be destroyed.
      // So make sure that the document really has been written to the database.
      resolve();
    })
  }
})

server.listen(port);

console.log(`Listening to http://localhost:${port} ${production ? '(production)' : ''}`)