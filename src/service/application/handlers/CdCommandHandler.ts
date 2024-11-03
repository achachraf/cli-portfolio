import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {resolveAbsolutePath} from "@/service/application/PathOperationsService";

export class CdCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    private portfolio: Portfolio;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolio = portfolioDataService.getPortfolio();
    }
    handle(input: CommandInput): CommandResult {
        const error:CommandResult|null = handleBadTool(input.tool, 'cd')
        if(error !== null) {
            return error
        }
        let usernamePath = "/home/" + this.portfolio.name.toLowerCase();
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