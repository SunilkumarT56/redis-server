import { DB } from "../utils/map.js";
import { Socket } from "net";
import {
  writeError,
  writeSimpleString,
  writeInteger,
  writeBulkString,
  writeNull,
} from "../helpers/respConverter.js";

const getHandler = (v: string[]) => {
  const cmd = v.slice(1);
  if (cmd.length !== 1) {
    return writeError("Invalid no of arguments for 'GET' command");
  }
  const name = cmd[0]!;
  if (!DB.has(name)) {
    return writeNull();
  }
  return writeBulkString(DB.get(name)!);
};
const setHandler = (v: string[]) => {
  const cmd = v.slice(1);
  if (cmd.length !== 2) {
    return writeError("Invalid no of arguments for 'SET' command");
  }
  const name = cmd[0]!;
  const value = cmd[1]!;
  DB.set(name, value);
  return writeSimpleString(value);
};
const Router = new Map<string, (v: string[]) => string>([
  ["GET", getHandler],
  ["SET", setHandler],
  ["COMMAND", () => writeSimpleString("OK")],
]);

export const handler = (socket: Socket, command: string[]) => {
  const cmd = command[0]!.toUpperCase();
  if (Router.has(cmd)) {
    socket.write(Router.get(cmd)!(command));
  } else {
    socket.write(writeError("unknown command"));
  }
};
