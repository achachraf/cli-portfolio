import {getSystemEnvironment} from "@/service/interlay/SystemEnvironment";
import SystemHierarchyService from "../application/SystemHierarchyService";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {DisplayCommandHandler} from "@/service/application/handlers/DisplayCommandHandler";
import {CatCommandHandler} from "@/service/application/handlers/CatCommandHandler";
import {CdCommandHandler} from "@/service/application/handlers/CdCommandHandler";
import {LsCommandHandler} from "@/service/application/handlers/LsCommandHandler";
import {NanoCommandHandler} from "@/service/application/handlers/NanoCommandHandler";

export default class CommandHandlersFactoryMap implements CommandHandlersFactory {

    async getCommandHandler(command: string): Promise<CommandHandler> {
        const { systemHierarchyService, portfolioDataService } = await getSystemEnvironment();
        const handlerFactory = handlers.get(command);
        if(handlerFactory === undefined) {
            throw new Error(`No such command: ${command}`);
        }
        return handlerFactory(systemHierarchyService, portfolioDataService);

    }
    
}


const handlers = new Map<string, (systemHierarchyService: SystemHierarchyService, portfolioDataService: PortfolioDataService) => CommandHandler>(
    [
        ['ls', (systemHierarchyService, portfolioDataService) => new LsCommandHandler(systemHierarchyService, portfolioDataService)],
        ['cd', (systemHierarchyService, portfolioDataService) => new CdCommandHandler(systemHierarchyService,portfolioDataService)],
        ['cat', (systemHierarchyService, portfolioDataService) => new CatCommandHandler(systemHierarchyService, portfolioDataService)],
        ['nano', (systemHierarchyService, portfolioDataService) => new NanoCommandHandler(systemHierarchyService, portfolioDataService)],
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
