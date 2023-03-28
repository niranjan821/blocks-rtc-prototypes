import { createSlice } from "@reduxjs/toolkit";

export interface INode{
   _id: string,
    x: number,
    y: number,
    height: number,
    width: number,
    stroke: string,
    strokeWidth: number,
    isVisible: false
}

export interface INodes{
    nodes: Array<INode>
}

const initialNodes: INodes = {
    nodes: []
}

const nodesSlice = createSlice({
    name: 'nodes',
    initialState: initialNodes,
    reducers: {
        addNodeInRedux: (state, { payload }) => {
            const nodes = state.nodes.slice();
            const index = nodes.findIndex((node) => (node as INode)._id === payload._id);
            if (index !== -1) {
                nodes[index] = payload;
                state.nodes = nodes;
            } else {
                state.nodes.push(payload);
            }
        },
        editNodeInRedux: (state, { payload }) => {
            const nodes = state.nodes.slice();
            const index = nodes.findIndex((node) => (node as INode)._id === payload._id);
            if (index !== -1) {
                if (payload.isVisible) {
                    nodes[index] = payload;
                    state.nodes = nodes;
                } else {
                    state.nodes.splice(index, 1);
                }
            }
        },
        deleteNodeInRedux: (state, { payload }) => {
            const index = state.nodes.findIndex((node) => (node as INode)._id === payload);
            if (index !== -1) {
                state.nodes.splice(index, 1);
            }
        },
    }
})

export const { addNodeInRedux, editNodeInRedux,
    deleteNodeInRedux
} = nodesSlice.actions;
export default nodesSlice.reducer;