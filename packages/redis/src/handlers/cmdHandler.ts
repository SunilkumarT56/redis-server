import { Socket } from "net";
import {
  writeError,
  writeSimpleString,
  writeBulkString,
  writeNull,
} from "../helpers/respConverter.js";
import { Store } from "../store.js";

const getHandler = (store: Store, v: string[]) => {
  const cmd = v.slice(1);
  if (cmd.length !== 1) {
    return writeError("Invalid no of arguments for 'GET' command");
  }

  const key = cmd[0]!;
  const value = store.get(key);

  if (value === null) {
    return writeNull();
  }

  return writeBulkString(value);
};

const setHandler = (store: Store, v: string[]) => {
  const cmd = v.slice(1);
  if (cmd.length !== 2) {
    return writeError("Invalid no of arguments for 'SET' command");
  }

  const key = cmd[0]!;
  const value = cmd[1]!;

  store.set(key, value);
  return writeSimpleString("OK");
};

const Router = new Map<
  string,
  (store: Store, v: string[]) => string
>([
  ["GET", getHandler],
  ["SET", setHandler],
  ["COMMAND", () => writeSimpleString("OK")],
]);

export const handler = (
  socket: Socket,
  store: Store,
  command: string[]
) => {
  const cmd = command[0]!.toUpperCase();

  if (!Router.has(cmd)) {
    socket.write(writeError("unknown command"));
    return;
  }

  const response = Router.get(cmd)!(store, command);
  socket.write(response);
};