import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
    isNewConversation: false,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, title } : conv,
      );
      if (state.selectedConversation?._id == conversationId)
        state.selectedConversation = { ...state.selectedConversation, title };
    },
    setIsNewConversation: (state, action) => {
      state.isNewConversation = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setConvTitle,
  setIsNewConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
