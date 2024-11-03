import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {resolveAbsolutePath} from "@/service/application/PathOperationsService";

export class CdCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    private portfolioDataService: PortfolioDataService;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolioDataService = portfolioDataService
    }
    async handle(input: CommandInput): Promise<CommandResult> {
        const portfolio = await this.portfolioDataService.getPortfolio();
        const error:CommandResult|null = handleBadTool(input.tool, 'cd')
        if(error !== null) {
            return error
        }
        let usernamePath = "/home/" + portfolio.name.toLowerCase();
        if(input.params.length === 0) {
            return {
                context: {
                    path: "~"
                },
                error: ''
            }
        }
        const path = resolveAbsolutePath(input, usernamePath);
        const exists = await this.systemHierarchyService.exists(path);
        if(exists) {
            const cleanContextPath = path.endsWith('/') ? path.slice(0, -1) : path;
            return {
                context: {
                    path: cleanContextPath.replace(usernamePath, '~')
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