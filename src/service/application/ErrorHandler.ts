export function handleBadTool(actualTool:string, expectedTool: string): CommandResult | null{
    if(actualTool !== expectedTool) {
        return {
            context: {
                path: ''
            },
            error: `Command not found, expected ${expectedTool}, got ${actualTool}`
        }
    }
    return null
}