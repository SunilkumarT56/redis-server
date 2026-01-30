import fs from "fs";
import path from "path";
import os from "os";
import type { Config } from "../types/types.d.ts";

const { Always, EverySec, No } = {
  Always: "always",
  EverySec: "everysec",
  No: "no",
};

export function parseConfig(filePath: string): Config {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  const config: Config = {
    dir: "",
    appendonly: false,
    appendfilename: "",
    appendfsync: EverySec,
    save: [],
    dbfilename: "",
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    const key = parts[0];

    switch (key) {
      case "dir": {
        config.dir = parts[1]!;
        break;
      }

      case "appendonly": {
        const value = parts[1];
        config.appendonly = value === "yes";
        break;
      }

      case "appendfilename": {
        config.appendfilename = parts[1]!;
        break;
      }

      case "appendfsync": {
        const value = parts[1];
        if (![Always, EverySec, No].includes(value!)) {
          throw new Error(`Invalid appendfsync value: ${value}`);
        }
        config.appendfsync = value!;
        break;
      }

      case "save": {
        const time = Number(parts[1]);
        const changes = Number(parts[2]);

        if (Number.isNaN(time) || Number.isNaN(changes)) {
          throw new Error(`Invalid save rule: ${trimmed}`);
        }

        config.save.push({ time, changes });
        break;
      }

      case "dbfilename": {
        config.dbfilename = parts[1]!;
        break;
      }

      default:
        throw new Error(`Unknown config directive: ${key}`);
    }
  }

  return config;
}

export const ensureDataDir = (dir: string): string => {
  let resolvedDir = dir.trim();

  if (resolvedDir.startsWith("~")) {
    resolvedDir = path.join(os.homedir(), resolvedDir.slice(1));
  }

  const resolvedPath = path.resolve(resolvedDir);

  try {
    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, {
        recursive: true,
        mode: 0o755,
      });
    }

    fs.chmodSync(resolvedPath, 0o755);
  } catch (err) {
    throw new Error(
      `Failed to create data directory "${resolvedPath}". ` +
        `Check permissions or choose another path.`,
    );
  }

  return resolvedPath;
};
