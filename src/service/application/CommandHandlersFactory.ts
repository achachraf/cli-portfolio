interface CommandHandlersFactory {
    getCommandHandler(command: string): Promise<CommandHandler>;
}