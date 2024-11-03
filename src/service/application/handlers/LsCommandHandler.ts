import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {resolveAbsolutePath} from "@/service/application/PathOperationsService";

export class LsCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    private portfolioDataService: PortfolioDataService;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolioDataService = portfolioDataService
    }


    async handle(input: CommandInput): Promise<CommandResult> {
        const portfolio = await this.portfolioDataService.getPortfolio();
        const error:CommandResult|null = handleBadTool(input.tool, 'ls')
        if(error !== null) {
            return error
        }
        let usernamePath = "/home/" + portfolio.name.toLowerCase();
        let path = resolveAbsolutePath(input, usernamePath);

        try{
            const list: FileDesc[] = await this.systemHierarchyService.list(path, input.params)
            const cleanContextPath = input.context.path.endsWith('/') ? input.context.path.slice(0, -1) : input.context.path;
            return {
                output: this.buildOutput(list),
                context: {
                    path: cleanContextPath
                },
                error: ''
            }
        } catch (error) {
            console.error("Error listing files", error);
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
