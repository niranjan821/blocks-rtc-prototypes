import { getSocketIo, getAmDoc, setAmDoc, getSyncState, setSyncState } from './AMconnect';
import { deleteNodeInRedux, INode } from './../../feature/nodes/nodesSlice';
import * as Automerge from '@automerge/automerge'

export const addOrUpdateNodesInAm = (data: INode) => {
    const socket = getSocketIo();
    const amDoc = getAmDoc();
    const newDoc = Automerge.change(amDoc, '', (doc) => {
        doc.nodes.push(data);
    })
    // const changes = Automerge.save(newDoc);
    // console.log(changes);
    // socket.emit('nodes', changes);
    // setAmDoc(newDoc);

    const changes = Automerge.getAllChanges(newDoc);
    console.log(changes);
    // const [sync1, msg] = Automerge.generateSyncMessage(newDoc, getSyncState());
    // console.log(msg);
    // setSyncState(sync1);
    socket.emit('nodes', changes);
    setAmDoc(newDoc);
}

export const deleteNodeInAm = (id: string) => {
    console.log('deleteNodeInAm', id)
    // const socket = getSocketIo();
    const amDoc = getAmDoc();
    const newDoc = Automerge.change(Automerge.clone(amDoc), '', (doc) => {
        const index = doc.nodes.findIndex((node: INode) => node._id === id);
        doc.nodes.splice(index, 1);
    });
    const changes = Automerge.getAllChanges(newDoc);
    console.log(changes);
    // socket.emit('nodes', changes);
    setAmDoc(newDoc);
}
