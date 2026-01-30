import net from "node:net";
import { parseRESP, valueToCommand } from "./utils/parseRESP.js";
import type { Value } from "./types/types.d.ts";
import { RESP_CONSTANTS, COMMANDS } from "./utils/CONSTANTS.js";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const value: Value = parseRESP(data.toString());
    const parsedCommand = valueToCommand(value);
    console.log(parsedCommand);
    const command = value.type === "*" ? value.array[0] : null;
    if (command?.type === "$" && command.bulk === COMMANDS.PING) {
      socket.write(RESP_CONSTANTS.PONG!);
    } else {
      socket.write(RESP_CONSTANTS.UNKNOWN_COMMAND!);
    }
    socket.on("end", () => {
      console.log("client disconnected");
    });
  });
});
server.listen(6379, () => {
  console.log("server started on Port 6379");
});
