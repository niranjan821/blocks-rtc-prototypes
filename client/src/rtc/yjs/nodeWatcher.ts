import { getYDoc } from './connectYJS';
import { deleteNode } from './nodeAction';
import { YEvent } from 'yjs';
import { addNodeInRedux, editNodeInRedux } from '../../feature/nodes/nodesSlice';
import { store } from '../../feature/store';

/**
 * Function to listen to YDocument Changes
 */
export const listenToYJSNodes = () => {
    const yDoc = getYDoc();
    const nodesMap = yDoc.getMap('nodes');
    nodesMap.observeDeep((events: YEvent<any>[]) => {
        events.forEach((event: YEvent<any>) => {
            event.changes.keys.forEach((change: { action: 'add' | 'update' | 'delete' }, key: any) => {
                if (change.action === 'add') {
                    const data = nodesMap.get(key) as any;
                    const nodeData = data.toJSON() as any;
                    store.dispatch(addNodeInRedux(nodeData));
                    console.log(data.toJSON())
                } else if (change.action === 'update') {
                    const data = nodesMap.get(key) as any;
                    const nodeData = data.toJSON() as any;
                    store.dispatch(editNodeInRedux(nodeData))
                    console.log(data.toJSON(), 'update')
                    if (!nodeData.isVisible) {
                        deleteNode(nodeData._id);
                    }
                }
            })
        });
    });
};