import CommandHandlersFactoryMap from "@/service/interlay/CommandHandlersFactoryMap"

export const dynamic = 'force-dynamic' // defaults to auto

const handlersFactory: CommandHandlersFactory = new CommandHandlersFactoryMap()

export async function POST (req: Request) {
    const body:CommandInput = await req.json()
    const result:CommandResult = handleCommand(body)
    return new Response(JSON.stringify(result))
}


const handleCommand = (input: CommandInput) : CommandResult => {
    return handlersFactory
            .getCommandHandler(input.tool)
            .handle(input)
}