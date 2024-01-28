import { FileNotFoundException } from "@/service/application/Exceptions"
import CommandHandlersFactoryMap from "@/service/interlay/CommandHandlersFactoryMap"

export const dynamic = 'force-dynamic' // defaults to auto

const handlersFactory: CommandHandlersFactory = new CommandHandlersFactoryMap()

export async function POST (req: Request) {
    const body:CommandInput = await req.json()
    const result:CommandResult = handleCommand(body)
    let status = {status: 200}
    if(result.error !== '') {
        status = {status: 400}
    }
    return new Response(JSON.stringify(result), status)
}


const handleCommand = (input: CommandInput) : CommandResult => {
    try{
        return handlersFactory
                .getCommandHandler(input.tool)
                .handle(input)
    }
    catch(error) {
        return {
            output: '',
            context: input.context,
            error: (error as Error).message
        }
    }
}