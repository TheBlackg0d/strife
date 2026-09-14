import { createSlice } from "@reduxjs/toolkit";
import type { Message } from "../../pages/channel/types/channel";

interface MessageState {
  messageIdInEditMode: string | null;
}

const initialState: MessageState = {
  messageIdInEditMode: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessageIdInEditMode: (state, action) => {
      state.messageIdInEditMode = action.payload;
    },
  },
});

export const { setMessageIdInEditMode } = messageSlice.actions;
export const messageReducer = messageSlice.reducer;
