// src/persistence/aof.ts
import fs from "fs";
import path from "path";
import type { PersistenceConfig } from "../types/types.d.js";
import os from "os";

export class AOF {
  private stream: fs.WriteStream;

  constructor(private config: PersistenceConfig) {
    let resolvedDir = config.dir.trim();

    if (resolvedDir.startsWith("~")) {
      resolvedDir = path.join(os.homedir(), resolvedDir.slice(1));
    }

    const resolvedPath = path.resolve(resolvedDir);
    const filePath = path.join(resolvedPath, config.appendfilename);
    this.stream = fs.createWriteStream(filePath, { flags: "a" });
  }

  append(command: string) {
    this.stream.write(command + "\n");
  }

  close() {
    this.stream.close();
  }
}
