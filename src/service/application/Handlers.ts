import { handleBadTool } from "./ErrorHandler";
import SystemHierarchyService from "./SystemHierarchyService";
import fs from 'fs';

let portfolio: Portfolio | undefined = undefined;

export function getPortfolio(): Portfolio {
    if(portfolio === undefined) {
        try {
            const porftolioPath = './src/service/application/Portfolio.json';
            const porftolioContent = fs.readFileSync(porftolioPath, 'utf8');
            portfolio  = JSON.parse(porftolioContent);
        } catch (error) {
            console.log("Error initializing portfolio", error);
            throw new Error(`Error while initializing portfolio: ${error}`);
        }
    }
    if(portfolio === undefined) {
        throw new Error(`Error while initializing portfolio`);
    }
    return portfolio;
}



export class LsCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    constructor(systemHierarchyService: SystemHierarchyService) {
        this.systemHierarchyService = systemHierarchyService
    }


    handle(input: CommandInput): CommandResult {
        const error:CommandResult|null = handleBadTool(input.tool, 'ls')
        if(error !== null) {
            return error
        }
        let usernamePath = "/home/" + getPortfolio().name.toLowerCase();
        let path = resolveAbsolutePath(input, usernamePath);

        try{
            const list: FileDesc[] = this.systemHierarchyService.list(path, input.params)
             return {
                output: this.buildOutput(list),
                context: input.context,
                error: ''
            }
        } catch (error) {
            return {
                context: input.context,
                error: "No such directory: "+path
            }
        }
        
    }    

    private buildOutput(list: FileDesc[]): RawContent {
        return {
            type: "text",
            data: list.map(file => file.isDirectory?file.name+"/":file.name).join('\n')
        }
    }
}

export class CdCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    constructor(systemHierarchyService: SystemHierarchyService) {
        this.systemHierarchyService = systemHierarchyService
    }
    handle(input: CommandInput): CommandResult {
        const error:CommandResult|null = handleBadTool(input.tool, 'cd')
        if(error !== null) {
            return error
        }
        let usernamePath = "/home/" + getPortfolio().name.toLowerCase();
        if(input.params.length === 0) {
            return {
                context: {
                    path: "~"
                },
                error: ''
            }
        }
        const path = resolveAbsolutePath(input, usernamePath);
        if(this.systemHierarchyService.exists(path)) {
            return {
                context: {
                    path: path.replace(usernamePath, '~')
                },
                error: ''
            }
        }
        else {
            return {
                context: input.context,
                error: "No such directory: "+path
            }
        }
    }
}

export class CatCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    constructor(systemHierarchyService: SystemHierarchyService) {
        this.systemHierarchyService = systemHierarchyService
    }
    handle(input: CommandInput): CommandResult {
        const error:CommandResult|null = handleBadTool(input.tool, 'cat')
        if(error !== null) {
            return error
        }
        if(input.params.length !== 1) {
            return {
                output: {type: "empty"},
                context: input.context,
                error: "Invalid number of arguments, cat requires exactly one argument"
            }
        }
        const {parent, filename} = splitPath(input);
        const content: RawContent | undefined = this.systemHierarchyService.read(parent, filename) as RawContent | undefined;
        if (content !== undefined) {
            return {
                output:{
                    type: "text", // override type to text
                    data: content.data
                },
                context: input.context,
                error: ''
            }
        } else {
            return {
                context: input.context,
                error: `No such file: ${parent}/${filename}`
            }
        }
    }
}

export class DisplayCommandHandler implements CommandHandler {
    
    private systemHierarchyService: SystemHierarchyService;

    constructor(systemHierarchyService: SystemHierarchyService) {
        this.systemHierarchyService = systemHierarchyService
    }


    handle(input: CommandInput): CommandResult {
        const error:CommandResult|null = handleBadTool(input.tool, 'display')
        if(error !== null) {
            return error
        }
        if(input.params.length !== 1 || !input.params[0].endsWith('.json')) {
            return {
                output: {type: "empty"},
                context: input.context,
                error: "Invalid number of arguments, display requires exactly one json argument"
            }
        }
        const {parent, filename} = splitPath(input);
        const content: JsonContent | undefined = this.systemHierarchyService.read(parent, filename) as JsonContent | undefined;
        if (content === undefined) {
            return {
                context: input.context,
                error: `No such file: ${parent}/${filename}`
            }
        }
        if(content.data === undefined || content.type !== "json") {
            return {
                context: input.context,
                error: `Invalid json file: ${parent}/${filename}`
            }
        }
        if(content.parsed === undefined) {
            try {
                content.parsed = JSON.parse(content.data);
            } catch (error) {
                console.error("Error parsing json file", error);
                return {
                    context: input.context,
                    error: `Invalid json file: ${parent}/${filename}`
                }
            }
        }
        return {
            output: content,
            context: input.context,
            error: ''
        }

    }



}

const resolveAbsolutePath = (input: CommandInput, userPath: string): string => {
    let path = '';
    if(input.params.length > 0 && !input.params[input.params.length-1].startsWith('-')) {
        path = input.params[input.params.length-1];
    }
    else {
        path = "";
    }
    if(path.startsWith("..")){
        path = path.replace("..", getParentFolder(input.context.path, userPath));
    }
    path = path.replace('./', "");
    if(!path.startsWith('/') && !path.startsWith('~')) {
        path = input.context.path + '/' + path;
    }
    if(path.startsWith('~')) {
        path = path.replace('~', userPath);
    }

    return path;
}

const splitPath = (input: CommandInput): {parent: string, filename: string} => {
    const filePath = input.params[0];
    let usernamePath = "/home/" + getPortfolio().name.toLowerCase();
    const absPath = resolveAbsolutePath(input, usernamePath);
    const parent = absPath.substring(0, absPath.lastIndexOf('/'));
    const filename = filePath.split('/').pop();
    if(filename === undefined) {
        throw new Error("Invalid file path: "+filePath);
    }
    return {
        parent,
        filename
    }
}
    

export const getParentFolder = (path: string, userPath: string): string => {
    const pathParts = path.replace("~", userPath).split('/');
    pathParts.pop();
    return pathParts.join('/');
}