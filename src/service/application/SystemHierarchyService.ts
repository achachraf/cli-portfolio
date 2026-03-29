import {SystemDataService} from "@/service/application/SystemDataService";
import PortfolioDataService from "@/service/application/PortfolioDataService";

export default interface SystemHierarchyService {

    list(path: string, options: string[]): Promise<FileDesc[]>

    exists(path: string): Promise<boolean>

    read(directory: string, file: string): Promise<RawContent | undefined>

    write(directory: string, file: string, content: RawContent): Promise<void>

    initialize(portfolioDataService: PortfolioDataService, systemDataService: SystemDataService): Promise<void>

}
