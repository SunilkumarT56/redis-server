import net from "node:net";
import { parseRESP, valueToCommand } from "./utils/parseRESP.js";
import type { Value } from "./types/types.d.ts";
import { handler } from "./handlers/cmdHandler.js";
import { writeSimpleString } from "./helpers/respConverter.js";
import { parseConfig, ensureDataDir } from "./config/config.js";
import { Store } from "./store.js";
import { loadAOF } from "./persistence/aofLoader.js";
import { AOF } from "./persistence/aof.js";
import path from "node:path";
import os from "node:os";

async function main() {
  const config = parseConfig(
    "/Users/sunilkumar/Projects/redis-server/redis.config",
  );
  const aof = config.aofenabled ? new AOF(config) : undefined;
  const store = new Store(aof);
  if (config.aofenabled) {
    let resolvedDir = config.dir.trim();
    if (resolvedDir.startsWith("~")) {
      resolvedDir = path.join(os.homedir(), resolvedDir.slice(1));
    }
    const resolvedPath = path.resolve(resolvedDir);
    const aofPath = path.join(resolvedPath, config.appendfilename);
    await loadAOF(aofPath, store);
  }
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
        handler(socket, store, parsedCommand);
      }
    });
  });
  ensureDataDir(config.dir);

  server.listen(6379, () => {});
}

main();
