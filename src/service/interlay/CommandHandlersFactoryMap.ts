import { CdCommandHandler, LsCommandHandler } from "../application/Handlers";
import SystemHierarchyService from "../application/SystemHierarchyService";
import SystemHierarchyServiceJson from "./SystemHierarchyServiceJson";

export default class CommandHandlersFactoryMap implements CommandHandlersFactory {


    getCommandHandler(command: string): CommandHandler {
        const handler = handlers.get(command);
        if(handler === undefined) {
            throw new Error(`No handler for command ${command}`);
        }
        return handler;
    }
    
}

const systemHierarchyService = new SystemHierarchyServiceJson();

const handlers = new Map<string, CommandHandler>(
    [
        ['ls', new LsCommandHandler(systemHierarchyService)],
        ['cd', new CdCommandHandler(systemHierarchyService)],
        // ['pwd', new PwdCommandHandler()],
        // ['cat', new CatCommandHandler()],
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

