import { io } from "socket.io-client";
import * as Automerge from '@automerge/automerge'
import { Socket } from "socket.io-client/build/esm/socket";
let socket: Socket;
let amDoc: Automerge.Doc<any>;
let syncState: Automerge.SyncState;

export function connectToAm() {
    socket = io("http://localhost:8001", {
        reconnectionDelayMax: 10000,
        autoConnect: true,
    });
    syncState = Automerge.initSyncState();
    socket.on('connect', function(){console.log('connected')});
    amDoc = Automerge.change(Automerge.init(), "", doc => {
        doc.nodes = [];
    });
    console.log(Automerge.getActorId(amDoc))
}

export const getSocketIo = () => socket;
export const getAmDoc = () => amDoc;
export const setAmDoc = (doc: Automerge.Doc<any>) => amDoc = doc;
export const getSyncState = () => syncState;
export const setSyncState = (newState: Automerge.SyncState) => syncState = newState;