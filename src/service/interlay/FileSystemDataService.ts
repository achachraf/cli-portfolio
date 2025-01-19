import { SystemDataService } from "../application/SystemDataService";
import fs from "fs";

export class FileSystemDataService implements SystemDataService {

    private readonly systemDescriptionPath: string;

    private systemData: FileDesc = {} as FileDesc;

    constructor(systemDescriptionPath: string) {
        this.systemDescriptionPath = systemDescriptionPath;
    }

    async getSystemData(): Promise<FileDesc> {
        if(this.systemData.files &&  this.systemData.files.length > 0) {
            return Promise.resolve(this.systemData);
        }
        const systemDescriptionContent = fs.readFileSync(this.systemDescriptionPath, 'utf8');
        const systemFiles:FileDesc[]  = JSON.parse(systemDescriptionContent).files;
        this.systemData = {
            name: "/",
            isDirectory: true,
            files: systemFiles
        }
        return Promise.resolve(this.systemData);
    }

    updateSystemData(systemData: FileDesc): void {
        this.systemData = systemData;
    }
}