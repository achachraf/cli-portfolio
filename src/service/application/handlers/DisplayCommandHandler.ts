import SystemHierarchyService from "@/service/application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {handleBadTool} from "@/service/application/ErrorHandler";
import {splitPath} from "@/service/application/PathOperationsService";

export class DisplayCommandHandler implements CommandHandler {

    private systemHierarchyService: SystemHierarchyService;

    private readonly portfolio: Portfolio;

    constructor(systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) {
        this.systemHierarchyService = systemHierarchyService
        this.portfolio = portfolioDataService.getPortfolio();
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
        const {parent, filename} = splitPath(input, this.portfolio);
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
