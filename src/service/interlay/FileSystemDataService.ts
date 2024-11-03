import { SystemDataService } from "../application/SystemDataService";
import fs from "fs";

export class FileSystemDataService implements SystemDataService {

    private readonly systemDescriptionPath: string;

    private systemData: FileDesc[] = [];

    constructor(systemDescriptionPath: string) {
        this.systemDescriptionPath = systemDescriptionPath;
    }

    async getSystemData(): Promise<FileDesc[]> {
        if(this.systemData.length > 0) {
            return Promise.resolve(this.systemData);
        }
        const systemDescriptionContent = fs.readFileSync(this.systemDescriptionPath, 'utf8');
        const initialSystemDesc:FileDesc[]  = JSON.parse(systemDescriptionContent).files;
        this.systemData = initialSystemDesc;
        return Promise.resolve(initialSystemDesc);
    }

    updateSystemData(systemData: FileDesc[]): void {
        this.systemData = systemData;
    }
}