import { useState } from "react";

export function useMessageDraft() {
  const [draft, setDraft] = useState("");

  const clearDraft = () => setDraft("");

  return { draft, setDraft, clearDraft };
}
