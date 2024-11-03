import {SystemDataService} from "../application/SystemDataService";

export class HttpSystemDataService implements SystemDataService {

    private readonly systemDescriptionUrl: string;

    private systemData: FileDesc[] = [];

    constructor(systemDescriptionUrl: string) {
        this.systemDescriptionUrl = systemDescriptionUrl;
    }

    async getSystemData(): Promise<FileDesc[]> {
        if(this.systemData.length > 0) {
            return this.systemData;
        }
        const response = await fetch(this.systemDescriptionUrl);
        this.systemData = (await response.json()).files;
        return this.systemData;
    }

    updateSystemData(systemData: FileDesc[]): void {
        this.systemData = systemData;
    }
}