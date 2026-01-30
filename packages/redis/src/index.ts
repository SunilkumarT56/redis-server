import net from "node:net";
import { parseRESP, valueToCommand } from "./utils/parseRESP.js";
import type { Value } from "./types/types.d.ts";
import { handler } from "./handlers/cmdHandler.js";
import {
  writeSimpleString,
  writeError,
  writeInteger,
  writeBulkString,
  writeNull,
} from "./helpers/respConverter.js";
import { parseConfig, ensureDataDir } from "./config/config.js";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const value: Value = parseRESP(data.toString());
    const parsedCommand = valueToCommand(value);
    const command = value.type === "*" ? value.array[0] : null;
    if (
      command?.type === "$" &&
      (command.bulk === "PING" || command.bulk === "ping")
    ) {
      socket.write(writeSimpleString("PONG"));
    } else {
      handler(socket, parsedCommand);
    }
  });
});
const parsedConfig = parseConfig(
  "/Users/sunilkumar/Projects/redis-server/redis.config",
);
ensureDataDir(parsedConfig.dir);

server.listen(6379, () => {});
