import SystemHierarchyService from "../application/SystemHierarchyService";
import fs from 'fs';
import { FileNotFoundException} from "../application/Exceptions";
import { getParentFolder, getPortfolio } from "../application/Handlers";

export default class SystemHierarchyServiceJson implements SystemHierarchyService {

    private static systemDescription: FileDesc[];

    constructor() {
        SystemHierarchyServiceJson.initialize();
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

    private static initialize(): void {
        if(SystemHierarchyServiceJson.systemDescription) return;
        try {
            const porftolio:Portfolio  = getPortfolio();
            const systemDescriptionPath = './src/service/interlay/SystemDescription.json';
            const systemDescriptionContent = fs.readFileSync(systemDescriptionPath, 'utf8');
            const initialSystemDesc:FileDesc[]  = JSON.parse(systemDescriptionContent).files;
            this.buildUserSystemDescription(initialSystemDesc, porftolio);
            SystemHierarchyServiceJson.systemDescription = initialSystemDesc;

        } catch (error) {
          throw new Error(`Error while initializing SystemDescription: ${error}`);
        }
    }

  
    private static buildUserSystemDescription(initialSystemDesc: FileDesc[], porftolio: Portfolio) {
        const projects:FileDesc[] = this.buildProjects(porftolio.projects);
        const experiences:FileDesc[] = this.buildExperiences(porftolio.experiences);
        const UserHome = initialSystemDesc
                        .find(file => file.name === 'home')
                        ?.files?.find(file => file.name === porftolio.name.toLowerCase());
        if(UserHome) {
            UserHome.files = (UserHome.files?UserHome.files:[]).concat([
                {
                    name: 'projects',
                    isDirectory: true,
                    files: [...projects, this.buildProjectsSynthesis(porftolio.projects)]
                },
                {
                    name: 'experiences',
                    isDirectory: true,
                    files: experiences
                }
            ]);
        }

    }

    private static buildProjects(projects: Project[]): FileDesc[] {
        return projects.map(project => {
            return {
                name: project.name,
                isDirectory: true,
                files: [
                    {
                        name: 'description.txt',
                        isDirectory: false,
                        content: {
                            type: 'text',
                            data: project.description
                        }
                    },
                    {
                        name: 'links',
                        isDirectory: true,
                        files: project.links?.map(link => {
                            return {
                                name: link.name,
                                isDirectory: false,
                                content: {
                                    type: 'text',
                                    data: link.url
                                }
                            }
                        })
                    },
                    {
                        name: 'tasks',
                        isDirectory: true,
                        files: project.tasks?.map(task => {
                            return {
                                name: task.name,
                                isDirectory: false,
                                content: {
                                    type: 'text',
                                    data: task.description
                                }
                            }
                        })
                    }
                ]
            }
        });
    }

    private static buildExperiences(experiences: Experience[]): FileDesc[] {
        return experiences.map(experience => {
            return {
                name: experience.name,
                isDirectory: true,
                files: [
                    {
                        name: 'info.txt',
                        isDirectory: false,
                        content: this.buildExperienceInfo(experience)
                    },
                ]
            }
        });
    }

    private static buildExperienceInfo(experience: Experience): RawContent {
        return {
            type: 'text',
            data:`Company: ${experience.company}
            Position: ${experience.position}
            Description: ${experience.description}
            Start Date: ${experience.startDate}
            End Date: ${experience.endDate}
            `
        } 
    }

    private static buildProjectsSynthesis(projects: Project[]):FileDesc {
        return {
            name: 'synthesis.json',
            isDirectory: false,
            content: {
                type: 'json',
                data: JSON.stringify(projects),
                dataType: 'projects'
            } as JsonContent
        }
    }
}



export type Portfolio = {
    name: string;
    projects: Project[];
    experiences: Experience[];
}

