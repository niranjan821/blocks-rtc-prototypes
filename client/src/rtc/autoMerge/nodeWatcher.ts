import { deleteNodeInRedux, INode } from './../../feature/nodes/nodesSlice';
import { getSocketIo, getAmDoc, setAmDoc, getSyncState, setSyncState } from './AMconnect';
import * as Automerge from '@automerge/automerge';
import { store } from '../../feature/store';
import { addNodeInRedux } from '../../feature/nodes/nodesSlice';
import { deleteNodeInAm } from './nodeAction';

export const listenToAmNodes = () => {
    const socket = getSocketIo();
    socket.on('nodes', (data) => {
        const amDoc = getAmDoc()
        const allChanges: Uint8Array[] = [];
        data.forEach((change: any) => {
            allChanges.push(new Uint8Array(change))
        })
        console.log(allChanges)
        const [newDoc] = Automerge.applyChanges(amDoc, allChanges);
        console.log(newDoc)
        // const msg = new Uint8Array(data);
        // const [newDoc, newSyncState] = Automerge.receiveSyncMessage(amDoc, getSyncState(), msg);
        // console.log(newDoc, newSyncState)
        // setSyncState(newSyncState);
        newDoc.nodes.forEach((node: INode) => {
            if (node.isVisible) {
                store.dispatch(addNodeInRedux(node));
            } else {
                deleteNodeInAm(node._id);
                store.dispatch(deleteNodeInRedux(node._id));
            }
        })
        setAmDoc(newDoc);
    })
}