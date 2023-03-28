import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rtc: 'YJS',
}

type rtcTypes = {
    payload: 'YJS' | 'GUN' | 'AUTOMERGE'
};

const rtcTypeSlice = createSlice({
    name: "rtcTypeSlice",
    initialState,
    reducers: {
        setRtcType: (state, { payload }: rtcTypes) => {
            state.rtc = payload;
        }
    }
})

export default rtcTypeSlice.reducer;
export const { setRtcType } = rtcTypeSlice.actions;