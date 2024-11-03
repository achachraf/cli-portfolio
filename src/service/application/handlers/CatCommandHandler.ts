import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {splitPath} from "@/service/application/PathOperationsService";

export class CatCommandHandler implements CommandHandler {

    private readonly systemHierarchyService: SystemHierarchyService;

    private readonly portfolioDataService: PortfolioDataService;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolioDataService = portfolioDataService

    }
    async handle(input: CommandInput): Promise<CommandResult> {
        const portfolio = await this.portfolioDataService.getPortfolio();
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
        const {parent, filename} = splitPath(input, portfolio);
        const content: RawContent | undefined = await this.systemHierarchyService.read(parent, filename) as RawContent | undefined;
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