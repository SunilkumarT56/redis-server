export const writeSimpleString = (str: string) => {
  return `+${str}\r\n`;
};

export const writeError = (message: string) => {
  return `-ERR ${message}\r\n`;
};

export const writeInteger = (num: number) => {
  return `:${num}\r\n`;
};

export const writeBulkString = (value: string) => {
  if (value === null || value === undefined) {
    return `$-1\r\n`;
  }

  const str = String(value);
  return `$${Buffer.byteLength(str)}\r\n${str}\r\n`;
};

export const writeNull = () => {
  return `$-1\r\n`;
};
