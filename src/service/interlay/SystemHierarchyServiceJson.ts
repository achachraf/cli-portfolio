import SystemHierarchyService from "../application/SystemHierarchyService";
import {FileNotFoundException} from "../application/Exceptions";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {buildExperiences, buildProjects, buildSynthesis} from "@/service/interlay/FileDescBuilders";
import {SystemDataService} from "@/service/application/SystemDataService";

export default class SystemHierarchyServiceJson implements SystemHierarchyService {


    private systemDataService: SystemDataService | undefined = undefined;


    async exists(path: string): Promise<boolean> {
        if (this.systemDataService === undefined) {
            throw new Error('SystemDataService not initialized');
        }
        if (path === '') return true;
        const systemDir = await this.systemDataService.getSystemData();
        try{
            const filesAtPath = this.getFilesAtPath(systemDir, path);
            return filesAtPath !== undefined;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }


    async list(path: string, options: string[] = []): Promise<FileDesc[]> {
        if (this.systemDataService === undefined) {
            throw new Error('SystemDataService not initialized');
        }
        const fileDesc = await this.systemDataService.getSystemData();
        if (path === '') {
            return fileDesc.files || [];
        }
        return this.getFilesAtPath(fileDesc, path);
    }

    async read(directory: string, file: string): Promise<RawContent | undefined> {
        if (this.systemDataService === undefined) {
            throw new Error('SystemDataService not initialized');
        }
        const fileDesc = await this.systemDataService.getSystemData();
        const filesAtPath = this.getFilesAtPath(fileDesc, directory);
        if (filesAtPath === undefined) {
            throw new FileNotFoundException(`No such directory: ${directory}`);
        }
        const found = filesAtPath.find(f => !f.isDirectory && f.name === file);
        if (found === undefined) {
            throw new FileNotFoundException(`No such file: ${directory}/${file}`);
        }
        return found.content;
    }

    async initialize(portfolioDataService: PortfolioDataService, systemDataService: SystemDataService): Promise<void> {
        try {
            this.systemDataService = systemDataService;
            const portfolio = await portfolioDataService.getPortfolio();
            const initialSystemDesc = await systemDataService.getSystemData();
            if(initialSystemDesc.files === undefined) {
                throw new Error('SystemDescription is empty');
            }
            this.buildUserSystemDescription(initialSystemDesc.files, portfolio);
            systemDataService.updateSystemData(initialSystemDesc);
        } catch (error) {
            throw new Error(`Error while initializing SystemDescription: ${error}`);
        }
    }


    private getFilesAtPath(systemDir: FileDesc, path: string): FileDesc[]  {
        const segments = path.split('/').filter(segment => segment !== '');
        let currentLevel = systemDir;
        for (let i = 0; i < segments.length; i++) {
            if (!currentLevel.isDirectory) {
                throw new Error(`Not a directory: ${currentLevel.name}`);
            }
            if (i === segments.length) {
                return currentLevel.files || [];
            }
            if (currentLevel.files === undefined) {
                throw new Error(`Directory is empty: ${currentLevel.name}`);
            }
            const nextDir = currentLevel.files.find(file => file.name === segments[i] && file.isDirectory);
            if (nextDir === undefined) {
                throw new Error(`No such directory: ${segments[i]}`);
            }
            currentLevel = nextDir;
        }
        return currentLevel.files || [];

    }


    // private getFilesAtPath(system: FileDesc[], path: string): FileDesc[] | undefined {
    //     const pathSegments = path.split('/').filter(segment => segment !== '');
    //
    //     // Traverse the system based on the path
    //     let currentLevel = system;
    //     for (const segment of pathSegments) {
    //         const folder = currentLevel?.find(item => item.name === segment && item.isDirectory);
    //         if (folder) {
    //             if (folder.files) {
    //                 currentLevel = folder.files;
    //             }
    //             else {
    //                 // directory is empty
    //                 return [];
    //             }
    //         }
    //         else {
    //             // Path not found
    //             return undefined;
    //         }
    //     }
    //
    //     // Return the files at the specified path
    //     return currentLevel;
    // }


    private buildUserSystemDescription(initialSystemDesc: FileDesc[], portfolio: Portfolio) {
        const projects: FileDesc[] = buildProjects(portfolio.projects);
        const experiences: FileDesc[] = buildExperiences(portfolio.experiences);
        const UserHome = initialSystemDesc
            ?.find(file => file.name === 'home')
            ?.files?.find(file => file.name === portfolio.name.toLowerCase());
        if (UserHome) {
            UserHome.files = (UserHome.files ? UserHome.files : []).concat([
                {
                    name: 'projects',
                    isDirectory: true,
                    files: [...projects, buildSynthesis(portfolio.projects, 'projects')]
                },
                {
                    name: 'experiences',
                    isDirectory: true,
                    files: [...experiences, buildSynthesis(portfolio.experiences, 'experiences')]
                },
                {
                    name: 'about',
                    isDirectory: true,
                    files: [
                        buildSynthesis(portfolio.about, 'about')
                    ]
                }
            ]);
        }


    }


}




