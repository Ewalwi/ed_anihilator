import { Command, CommandHandler } from "../types/commands";

class CommandSystem {
  private commands: Map<string, Command> = new Map();

  register(name: string, handler: CommandHandler, description?: string): void {
    this.commands.set(name, { handler, description });
  }

  async execute(input: string, print: (text: string) => void): Promise<string | void> {
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0];
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    
    if (!command) {
      return `Unknown command: ${commandName}`;
    }

    try {
      return await command.handler(args, print);
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  list(): string {
    const commandList = Array.from(this.commands.entries())
      .map(([name, cmd]) => `  ${name}${cmd.description ? ` - ${cmd.description}` : ''}`)
      .join('\n');
    return `Available commands:\n${commandList}`;
  }
}

export { CommandSystem };