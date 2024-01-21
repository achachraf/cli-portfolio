interface CommandHandlersFactory {
    getCommandHandler(command: string): CommandHandler;
}