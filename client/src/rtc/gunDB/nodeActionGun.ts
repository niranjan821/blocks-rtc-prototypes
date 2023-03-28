import { INode } from '../../feature/nodes/nodesSlice';
import { store } from '../../feature/store';
import { getGun } from './connect';

export const addOrUpdateNodeInGun = (data: INode) => {
    console.count('addNodeInGun')
    const gun = getGun();
    const node = gun.get(data._id).put(data);
    const nodes = gun.get('nodes');
    nodes.set(node);
}

export const updateNodeInGun = (data: INode) => {
    console.count('updateNodeInGun')
    const gun = getGun();
    const nodes = gun.get('nodes');
    nodes.get(data._id).put(data);
}

export const deleteNodeInGun = (id: string) => {
    console.count('deleteNodeInGun')
    const gun = getGun();
    const nodes = gun.get('nodes');
    nodes.get(id).put(null);
}
