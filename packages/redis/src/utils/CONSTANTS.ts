export const RESP_CONSTANTS: { [key: string]: string } = {
  UNKNOWN_COMMAND: "-ERR unknown command\r\n",
  PONG: "+PONG\r\n",
  OK: "+OK\r\n",
  NULL: "$-1\r\n",
  EMPTY_ARRAY: "*0\r\n",
};

export const COMMANDS = {
  PING: "PING",
  ECHO: "ECHO",
  SET: "SET",
  GET: "GET",
  DEL: "DEL",
  EXISTS: "EXISTS",
  INCR: "INCR",
  DECR: "DECR",
  KEYS: "KEYS",
  TYPE: "TYPE",
  QUIT: "QUIT",
  INFO: "INFO",
  COMMAND: "COMMAND",
};
