export type Value =
  | { type: "+"; str: string }
  | { type: "$"; bulk: string }
  | { type: "*"; array: Value[] };

export type Config = {
  dir: string;
  appendonly: boolean;
  appendfilename: string;
  appendfsync: string;
  save: {
    time: number;
    changes: number;
  }[];
  dbfilename: string;
};