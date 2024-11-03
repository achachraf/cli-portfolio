import CommandHandlersFactoryMap from "@/service/interlay/CommandHandlersFactoryMap"
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

const handlersFactory: CommandHandlersFactory = new CommandHandlersFactoryMap()

export async function POST (req: Request) {
    const body:CommandInput = await req.json()
    const result:CommandResult = await handleCommand(body)
    if(result.error !== '') {
        return new NextResponse(JSON.stringify({error: result.error}), {status: 400})
    }
    return new Response(JSON.stringify(result), {status: 200})
}


const handleCommand = async (input: CommandInput) : Promise<CommandResult> => {
    try{
        const handler = await handlersFactory.getCommandHandler(input.tool)
        return await handler.handle(input)
    }
    catch(error) {
        console.error(error)
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