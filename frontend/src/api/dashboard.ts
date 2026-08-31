import type { Friend } from "../types/dashboard";
import { api } from "./api";

const getFriendList = async (): Promise<Friend[]> => {
  const res = await api.get<Friend[]>("relationships/friends");
  return res.data;
};

export { getFriendList };
