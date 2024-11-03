import SystemHierarchyService from "../application/SystemHierarchyService";
import fs from 'fs';
import { FileNotFoundException} from "../application/Exceptions";
import PortfolioDataService from "@/service/application/PortfolioDataService";
import {buildExperiences, buildProjects, buildSynthesis} from "@/service/interlay/FileDescBuilders";

export default class SystemHierarchyServiceJson implements SystemHierarchyService {

    private static systemDescription: FileDesc[];

    private readonly portfolio: Portfolio;

    constructor(portfolioDataService: PortfolioDataService) {
        this.portfolio = portfolioDataService.getPortfolio();
        this.initialize();
    }
    exists(path: string): boolean {
        if(path === '') return true;
        const filesAtPath = this.getFilesAtPath(SystemHierarchyServiceJson.systemDescription, path);
        return filesAtPath !== undefined;
    }


    list(path: string, options: string[]=[]): FileDesc[] {

        if(path === '') {
            return SystemHierarchyServiceJson.systemDescription;
        }
        const filesAtPath = this.getFilesAtPath(SystemHierarchyServiceJson.systemDescription, path);
        if(filesAtPath === undefined) {
            throw new FileNotFoundException(`No such directory: ${path}`);
        }
        return filesAtPath;
    }

    read(directory: string, file: string): RawContent | undefined {
        const filesAtPath = this.getFilesAtPath(SystemHierarchyServiceJson.systemDescription, directory);
        if(filesAtPath === undefined) {
            throw new FileNotFoundException(`No such directory: ${directory}`);
        }
        const found = filesAtPath.find(f => !f.isDirectory && f.name === file);
        if(found === undefined) {
            throw new FileNotFoundException(`No such file: ${directory}/${file}`);
        }
        return found.content;
    }


    private getFilesAtPath(system: FileDesc[], path: string): FileDesc[] | undefined {
        const pathSegments = path.split('/').filter(segment => segment !== '');
    
        // Traverse the system based on the path
        let currentLevel = system;
        for (const segment of pathSegments) {
            const folder = currentLevel.find(item => item.name === segment && item.isDirectory);
            if (folder && folder.files) {
                currentLevel = folder.files;
            } else {
                // Path not found
                return undefined;
            }
        }
    
        // Return the files at the specified path
        return currentLevel;
    }

    private initialize(): void {
        if(SystemHierarchyServiceJson.systemDescription) return;
        try {
            const systemDescriptionPath = process.env.SYSTEM_DESCRIPTION_PATH || '/opt/cli-portfolio/systemDescription.json';
            const systemDescriptionContent = fs.readFileSync(systemDescriptionPath, 'utf8');
            const initialSystemDesc:FileDesc[]  = JSON.parse(systemDescriptionContent).files;
            this.buildUserSystemDescription(initialSystemDesc, this.portfolio);
            SystemHierarchyServiceJson.systemDescription = initialSystemDesc;

        } catch (error) {
          throw new Error(`Error while initializing SystemDescription: ${error}`);
        }
    }

  
    private  buildUserSystemDescription(initialSystemDesc: FileDesc[], portfolio: Portfolio) {
        const projects:FileDesc[] = buildProjects(portfolio.projects);
        const experiences:FileDesc[] = buildExperiences(portfolio.experiences);
        const UserHome = initialSystemDesc
                        .find(file => file.name === 'home')
                        ?.files?.find(file => file.name === portfolio.name.toLowerCase());
        if(UserHome) {
            UserHome.files = (UserHome.files?UserHome.files:[]).concat([
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




