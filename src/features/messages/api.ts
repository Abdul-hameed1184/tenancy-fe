import { USE_MOCKS } from "@/lib/api/config";
import * as mock from "./api.mock";
import * as remote from "./api.remote";

const api: typeof remote = USE_MOCKS ? mock : remote;

export const {
  getThreads,
  getThreadMessages,
  sendMessage,
} = api;
