import {NextResponse} from "next/server";
import {getSystemEnvironment} from "@/service/interlay/SystemEnvironment";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const body = await req.json();
    const { directory, filename, content } = body;
    if(directory === undefined || filename === undefined || typeof content !== 'string') {
        return NextResponse.json({error: 'Missing required fields: directory, filename, content'}, {status: 400});
    }
    try {
        const { systemHierarchyService } = await getSystemEnvironment();
        await systemHierarchyService.write(directory, filename, { type: 'text', data: content });
        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Error saving nano file:", error);
        return NextResponse.json({error: (error as Error).message}, {status: 500});
    }
}
