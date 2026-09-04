import { createContext } from "react-router";
import type { Profile } from "../types/profile";

export const userContext = createContext<Profile>();
