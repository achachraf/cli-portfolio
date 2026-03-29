import SystemHierarchyServiceJson from "@/service/interlay/SystemHierarchyServiceJson";
import {getPortfolioDataService} from "@/service/interlay/PortfolioDataServiceFactory";
import {getSystemDataService} from "@/service/interlay/SystemHierarchyServiceFactory";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import SystemHierarchyService from "@/service/application/SystemHierarchyService";

let initializationPromise: Promise<{
    systemHierarchyService: SystemHierarchyService;
    portfolioDataService: PortfolioDataService;
}> | undefined;

export const getSystemEnvironment = async () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            const portfolioDataService = getPortfolioDataService();
            const systemDataService = getSystemDataService();
            const systemHierarchyService = new SystemHierarchyServiceJson();
            await systemHierarchyService.initialize(portfolioDataService, systemDataService);
            return {
                systemHierarchyService,
                portfolioDataService
            };
        })();
    }
    return initializationPromise;
};
