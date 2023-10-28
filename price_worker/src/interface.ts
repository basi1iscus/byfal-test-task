export enum CommandType {
  RUN = 'RUN',
  STOP = 'STOP',
}

export interface Command {
  command: CommandType;
  body: Record<string, any>;
}
