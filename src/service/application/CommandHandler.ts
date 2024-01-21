interface CommandHandler {
    handle(input: CommandInput): CommandResult;
}