import { addNodeInRedux, deleteNodeInRedux } from '../../feature/nodes/nodesSlice';
import { store } from '../../feature/store';
import { getGun } from './connect';
import { deleteNodeInGun } from './nodeActionGun';

const listenToNodesInGun = () => {
    const gun = getGun();
    const nodes = gun.get('nodes');
    nodes.map().on((data, id) => {
        console.log(data);
        if (data) {
            const node = { ...data };
            delete node._;
            store.dispatch(addNodeInRedux(node));    
            if (!node.isVisible) {
                deleteNodeInGun(node._id as string)
            }
        } else if (data === null) {

            store.dispatch(deleteNodeInRedux(id));
        }
    });
}    

export default listenToNodesInGun;
