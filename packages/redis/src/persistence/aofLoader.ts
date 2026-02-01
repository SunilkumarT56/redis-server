import fs from "fs";
import readline from "readline";
import { Store } from "../store.js";

export const loadAOF = async (filePath: string, store: Store)=> {
  if (!fs.existsSync(filePath)) return;

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [cmd, key, value] = line.split(" ");

    if (cmd === "SET") store.set(key!, value!);
    if (cmd === "DEL") store.del(key!);
  }
}
