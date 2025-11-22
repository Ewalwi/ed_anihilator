export type CommandHandler = (args: string[], print: (text: string) => void) => Promise<string | void> | string | void;

export interface Command {
  handler: CommandHandler;
  description?: string;
}