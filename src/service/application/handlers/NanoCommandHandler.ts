import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {FileNotFoundException} from "@/service/application/Exceptions";
import {splitPath} from "@/service/application/PathOperationsService";
import {NanoContent} from "@/domain/NanoContent";

export class NanoCommandHandler implements CommandHandler {

    private readonly systemHierarchyService: SystemHierarchyService;

    private readonly portfolioDataService: PortfolioDataService;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolioDataService = portfolioDataService
    }

    async handle(input: CommandInput): Promise<CommandResult> {
        const error: CommandResult | null = handleBadTool(input.tool, 'nano')
        if(error !== null) {
            return error
        }
        if(input.params.length !== 1) {
            return {
                output: {type: "empty"},
                context: input.context,
                error: "Invalid number of arguments, nano requires exactly one argument"
            }
        }
        const portfolio = await this.portfolioDataService.getPortfolio();
        const {parent, filename, absolutePath} = splitPath(input, portfolio);
        let initialContent = '';
        try {
            const existing = await this.systemHierarchyService.read(parent, filename);
            if(existing?.data) {
                initialContent = existing.data;
            }
        } catch (error) {
            if (!(error instanceof FileNotFoundException)) {
                console.error("Error opening file in nano:", error);
                return {
                    context: input.context,
                    error: (error as Error).message
                }
            }
        }
        return {
            output: {
                type: 'nano',
                data: initialContent,
                filePath: absolutePath,
                directory: parent,
                filename
            } as NanoContent,
            context: input.context,
            error: ''
        }
    }
}
