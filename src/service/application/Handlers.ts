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
                output: list.map(file => file.isDirectory?file.name+"/":file.name).join('\n'),
                context: input.context,
                error: ''
            }
        } catch (error) {
            return {
                output: '',
                context: input.context,
                error: "No such directory: "+path
            }
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
                output: '',
                context: {
                    path: "~"
                },
                error: ''
            }
        }
        const path = resolveAbsolutePath(input, usernamePath);
        if(this.systemHierarchyService.exists(path)) {
            return {
                output: '',
                context: {
                    path: path.replace(usernamePath, '~')
                },
                error: ''
            }
        }
        else {
            return {
                output: '',
                context: input.context,
                error: "No such directory: "+path
            }
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

const getParentFolder = (path: string, userPath: string): string => {
    const pathParts = path.replace("~", userPath).split('/');
    pathParts.pop();
    return pathParts.join('/');
}