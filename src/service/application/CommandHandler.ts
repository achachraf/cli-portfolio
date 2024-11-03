interface CommandHandler {
    handle(input: CommandInput): Promise<CommandResult>;
}