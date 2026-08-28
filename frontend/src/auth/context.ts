import { createContext } from "react-router";
import type { Account } from "./types/auth";

export const userContext = createContext<Account>();
