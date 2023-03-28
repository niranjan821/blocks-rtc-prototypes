import { getYDoc } from './connectYJS';
import * as Y from 'yjs';
import { INode } from '../../feature/nodes/nodesSlice';
import lodash from 'lodash';
/**
 * Function to create YType of the Node
 * @param node Node to Convert
 * @returns YType of the Node
 */
export const nodeToYtype = (node: INode) => {
    const nodeMap = new Y.Map();
    const keys = Object.keys(node);
    keys.forEach(key => {
        nodeMap.set(key, node[key as keyof INode]);
    })
    return nodeMap;
}


/**
 * Function to add/update node in YMap
 * @param payload node
 */
export const addOrUpdateNodeInRTC = async (data: any) => {
    const yDoc = getYDoc();
    const nodesMap = yDoc.getMap('nodes');
    const nodeData = lodash.clone(data);

    if (nodeData._id) {
        const payloadMap = new Y.Map();
        const convertedNode = nodeToYtype(nodeData);
        nodesMap.set(nodeData._id, convertedNode);
    }
    
}


/**
 * Function to remove node from YMap
 * @param id Node Id
 */
export const deleteNode = (id: string) => {
    const yDoc = getYDoc();
    const nodesMap = yDoc.getMap('nodes');
    nodesMap.delete(id);
}