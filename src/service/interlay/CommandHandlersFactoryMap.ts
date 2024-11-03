import SystemHierarchyServiceJson from "./SystemHierarchyServiceJson";
import {DisplayCommandHandler} from "@/service/application/handlers/DisplayCommandHandler";
import {CatCommandHandler} from "@/service/application/handlers/CatCommandHandler";
import {CdCommandHandler} from "@/service/application/handlers/CdCommandHandler";
import {LsCommandHandler} from "@/service/application/handlers/LsCommandHandler";
import {getPortfolioDataService} from "@/service/interlay/PortfolioDataServiceFactory";

export default class CommandHandlersFactoryMap implements CommandHandlersFactory {


    getCommandHandler(command: string): CommandHandler {
        const handler = handlers.get(command);
        if(handler === undefined) {
            throw new Error(`Command not found: ${command}`);
        }
        return handler;
    }
    
}

const portfolioDataService = getPortfolioDataService();
const systemHierarchyService = new SystemHierarchyServiceJson(portfolioDataService);

const handlers = new Map<string, CommandHandler>(
    [
        ['ls', new LsCommandHandler(systemHierarchyService, portfolioDataService)],
        ['cd', new CdCommandHandler(systemHierarchyService,portfolioDataService)],
        ['cat', new CatCommandHandler(systemHierarchyService, portfolioDataService)],
        ['display', new DisplayCommandHandler(systemHierarchyService,portfolioDataService)],
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

