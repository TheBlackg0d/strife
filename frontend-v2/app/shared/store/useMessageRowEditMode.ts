import { create } from "zustand";

type MessageRowEditModeState = {
  messageIdInEditMode: string | null;
  setMessageIdInEditMode: (messageId: string | null) => void;
};

export const useMessageRowEditMode = create<MessageRowEditModeState>((set) => ({
  messageIdInEditMode: null,
  setMessageIdInEditMode: (messageId: string | null) =>
    set({ messageIdInEditMode: messageId }),
}));
