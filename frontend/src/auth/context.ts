import { createContext } from "react-router";
import type { User } from "./types/auth";

export const userContext = createContext<User>();
