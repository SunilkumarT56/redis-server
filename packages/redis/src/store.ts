import { AOF } from "./persistence/aof.js";

export class Store {
  private data = new Map<string, string>();

  constructor(private aof?: AOF) {}

  set(key: string, value: string) {
    this.data.set(key, value);
    this.aof?.append(`SET ${key} ${value}`);
  }

  get(key: string) {
    return this.data.get(key) ?? null;
  }

  del(key: string) {
    this.data.delete(key);
    this.aof?.append(`DEL ${key}`);
  }
}
