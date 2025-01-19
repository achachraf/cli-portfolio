export interface SystemDataService {

    getSystemData(): Promise<FileDesc>

    updateSystemData(systemData: FileDesc): void
}