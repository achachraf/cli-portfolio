import {SystemDataService} from "../application/SystemDataService";

export class HttpSystemDataService implements SystemDataService {

    private readonly systemDescriptionUrl: string;

    private systemData: FileDesc = {
        name: "/",
        isDirectory: true,
        files: []
    }

    constructor(systemDescriptionUrl: string) {
        this.systemDescriptionUrl = systemDescriptionUrl;
    }

    async getSystemData(): Promise<FileDesc> {
        if(this.systemData.files && this.systemData.files.length > 0) {
            return Promise.resolve(this.systemData);
        }
        const response = await fetch(this.systemDescriptionUrl);
        const systemFiles = (await response.json()).files;
        const systemDir = {
            name: "/",
            isDirectory: true,
            location: "/",
            files: systemFiles
        }
        this.systemData = systemDir;
        return systemDir;
    }

    updateSystemData(systemData: FileDesc): void {
        this.systemData = systemData;
    }
}