import {SystemDataService} from "@/service/application/SystemDataService";
import {HttpSystemDataService} from "./HttpSystemDataService";
import {FileSystemDataService} from "./FileSystemDataService";

export const getSystemDataService = (): SystemDataService => {

    const systemDescriptionPath = process.env.SYSTEM_DESCRIPTION_PATH || '/opt/cli-portfolio/systemDescription.json';
    if(systemDescriptionPath.startsWith('http')) {
        return new HttpSystemDataService(systemDescriptionPath);
    }
    return new FileSystemDataService(systemDescriptionPath);


}