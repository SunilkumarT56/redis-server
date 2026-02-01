export type Value =
  | { type: "+"; str: string }
  | { type: "$"; bulk: string }
  | { type: "*"; array: Value[] };

export type PersistenceConfig= {
  dir: string;
  appendonly: boolean;
  appendfilename: string;
  appendfsync: string;
  aofenabled: boolean;
  save: {
    time: number;
    changes: number;
  }[];
  dbfilename: string;
};