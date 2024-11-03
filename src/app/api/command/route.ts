import CommandHandlersFactoryMap from "@/service/interlay/CommandHandlersFactoryMap"
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

const handlersFactory: CommandHandlersFactory = new CommandHandlersFactoryMap()

export async function POST (req: Request) {
    const body:CommandInput = await req.json()
    const result:CommandResult = handleCommand(body)
    if(result.error !== '') {
        return new NextResponse(JSON.stringify({error: result.error}), {status: 400})
    }
    return new Response(JSON.stringify(result), {status: 200})
}


const handleCommand = (input: CommandInput) : CommandResult => {
    try{
        return handlersFactory
                .getCommandHandler(input.tool)
                .handle(input)
    }
    catch(error) {
        return {
            output: {
                type: 'text',
                data: ''
            },
            context: input.context,
            error: (error as Error).message
        }
    }
}