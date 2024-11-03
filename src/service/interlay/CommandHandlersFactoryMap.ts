import SystemHierarchyServiceJson from "./SystemHierarchyServiceJson";
import {DisplayCommandHandler} from "@/service/application/handlers/DisplayCommandHandler";
import {CatCommandHandler} from "@/service/application/handlers/CatCommandHandler";
import {CdCommandHandler} from "@/service/application/handlers/CdCommandHandler";
import {LsCommandHandler} from "@/service/application/handlers/LsCommandHandler";
import {getPortfolioDataService} from "@/service/interlay/PortfolioDataServiceFactory";
import {getSystemDataService} from "@/service/interlay/SystemHierarchyServiceFactory";
import SystemHierarchyService from "../application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";

export default class CommandHandlersFactoryMap implements CommandHandlersFactory {

    private systemHierarchyService: SystemHierarchyService | undefined = undefined;

    private portfolioDataService: PortfolioDataService | undefined = undefined;

    async getCommandHandler(command: string): Promise<CommandHandler> {
        if(this.systemHierarchyService === undefined || this.portfolioDataService === undefined) {
            this.portfolioDataService = getPortfolioDataService();
            const systemDataService = getSystemDataService();
            this.systemHierarchyService = new SystemHierarchyServiceJson();
            await this.systemHierarchyService.initialize(this.portfolioDataService, systemDataService);
        }
        const handlerFactory = handlers.get(command);
        if(handlerFactory === undefined) {
            throw new Error(`No such command: ${command}`);
        }
        return handlerFactory(this.systemHierarchyService, this.portfolioDataService);

    }
    
}


const handlers = new Map<string, (systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) => CommandHandler>(
    [
        ['ls', (systemHierarchyService, portfolioDataService) => new LsCommandHandler(systemHierarchyService, portfolioDataService)],
        ['cd', (systemHierarchyService, portfolioDataService) => new CdCommandHandler(systemHierarchyService,portfolioDataService)],
        ['cat', (systemHierarchyService, portfolioDataService) => new CatCommandHandler(systemHierarchyService, portfolioDataService)],
        ['display', (systemHierarchyService, portfolioDataService) => new DisplayCommandHandler(systemHierarchyService,portfolioDataService)],
        // ['pwd', new PwdCommandHandler()],
        // ['echo', new EchoCommandHandler()],
        // ['mkdir', new MkdirCommandHandler()],
        // ['touch', new TouchCommandHandler()],
        // ['rm', new RmCommandHandler()],
        // ['mv', new MvCommandHandler()],
        // ['cp', new CpCommandHandler()],
        // ['clear', new ClearCommandHandler()],
        // ['help', new HelpCommandHandler()],
        // ['exit', new ExitCommandHandler()]
    ]
);


