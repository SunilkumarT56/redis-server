export type Value =
  | { type: "+"; str: string }
  | { type: "$"; bulk: string }
  | { type: "*"; array: Value[] };