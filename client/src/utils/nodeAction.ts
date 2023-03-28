import { addOrUpdateNodeInGun, updateNodeInGun } from './../rtc/gunDB/nodeActionGun';
import { addNodeInRedux, deleteNodeInRedux, editNodeInRedux, INode } from './../feature/nodes/nodesSlice';
import { store } from "../feature/store";
import { addOrUpdateNodeInRTC } from '../rtc/yjs/nodeAction';
import { deleteNodeInGun } from '../rtc/gunDB/nodeActionGun';
import lodash from 'lodash';
import { addOrUpdateNodesInAm } from '../rtc/autoMerge/nodeAction';

export const deleteAllNodes = () => {
    const { nodes, rtcType } = store.getState();
    const cNodes = lodash.cloneDeep(nodes.nodes)
    cNodes.forEach((node: INode) => {
        const nodeToBeDel = { ...node };
        nodeToBeDel.isVisible = false;
        store.dispatch(deleteNodeInRedux(nodeToBeDel._id));
        switch (rtcType.rtc) {
            case 'YJS':
                addOrUpdateNodeInRTC(nodeToBeDel);
                break;
            case 'GUN':
                updateNodeInGun(nodeToBeDel);
                break;
            case 'AUTOMERGE':
                addOrUpdateNodesInAm(nodeToBeDel);
                break;
        }
    });
}

export const addOrUpdateNode = (node: INode, type: string) => {
    const { rtcType } = store.getState();
    if (type === 'add') {
        store.dispatch(addNodeInRedux(node));
    } else if(type === 'update') {
        store.dispatch(editNodeInRedux(node));
    } else {
        store.dispatch(deleteNodeInRedux(node._id));
    }
    switch (rtcType.rtc) {
        case 'YJS':
            addOrUpdateNodeInRTC(node);
            break;
        case 'GUN':
            if (type === 'add') {
                addOrUpdateNodeInGun(node);
            } else{
                updateNodeInGun(node);
            }
            break;
        case 'AUTOMERGE':
            addOrUpdateNodesInAm(node);
    }
}