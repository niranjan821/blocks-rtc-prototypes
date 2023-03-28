import { configureStore } from "@reduxjs/toolkit";
import nodesSlice from "./nodes/nodesSlice";
import rtcTypeSlice from "./rtcTypeSlice";


export const store = configureStore({
    reducer: {nodes: nodesSlice, rtcType: rtcTypeSlice},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch