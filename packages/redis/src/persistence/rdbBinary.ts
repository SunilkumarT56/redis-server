import fs from "fs";
import path from "path";
import type { PersistenceConfig } from "../types/types.d.js";

const RDB_MAGIC = "REDIS";
const RDB_VERSION = "0001";

const RDB_TYPE_STRING = 0x00;
const RDB_OPCODE_EOF = 0xff;

function writeString(fd: number, str: string) {
  const buf = Buffer.from(str);
  const len = buf.length;
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(len);
  fs.writeSync(fd, lenBuf);

  fs.writeSync(fd, buf);
}

export function saveRDBBinary(
  data: Map<string, string>,
  config: PersistenceConfig,
) {

  const rdbPath = path.join(config.dir, config.dbfilename);
  const tmpPath = rdbPath + ".tmp";

  const fd = fs.openSync(tmpPath, "w");

  try {

    fs.writeSync(fd, Buffer.from(RDB_MAGIC));
    fs.writeSync(fd, Buffer.from(RDB_VERSION));

   
    for (const [key, value] of data.entries()) {
    
      fs.writeSync(fd, Buffer.from([RDB_TYPE_STRING]));

      writeString(fd, key);
      writeString(fd, value);
    }

    fs.writeSync(fd, Buffer.from([RDB_OPCODE_EOF]));
  } finally {
    fs.closeSync(fd);
  }

  fs.renameSync(tmpPath, rdbPath);
}
