import type { Value } from "../types/types.d.ts";

export const parseRESP = (input: string): Value => {
  let i = 0;

  function readLine(): string {
    const end = input.indexOf("\r\n", i);
    if (end === -1) throw new Error("Invalid RESP");
    const line = input.slice(i, end);
    i = end + 2;
    return line;
  }
  function parseValue(): Value {
    const prefix = input[i++];

    if (prefix === "*") {
      const count = parseInt(readLine(), 10);
      const array: Value[] = [];
      for (let j = 0; j < count; j++) {
        array.push(parseValue());
      }
      return { type: "*", array };
    }
    if (prefix === "$") {
      const length = parseInt(readLine(), 10);
      const data = input.slice(i, i + length);
      i += length + 2;
      return { type: "$", bulk: data };
    }
    throw new Error(`Unknown RESP type: ${prefix}`);
  }
  return parseValue();
};
export const valueToCommand = (v: Value): string[] => {
  if (v.type !== "*") throw new Error("Expected array");
  return v.array.map((item) => {
    if (item.type !== "$") throw new Error("Expected bulk string");
    return item.bulk;
  });
};
