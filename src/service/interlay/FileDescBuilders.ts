export const buildProjects = (projects: Project[]): FileDesc[] => {
    return projects.map(project => {
        return {
            name: project.name.replace(/\s/g, '_'),
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
                buildSynthesis(project, 'project'),
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

export const buildExperiences = (experiences: Experience[]): FileDesc[] => {
    return experiences.map(experience => {
        return {
            name: experience.name.replace(/\s/g, '_'),
            isDirectory: true,
            files: [
                {
                    name: 'description.txt',
                    isDirectory: false,
                    content: buildExperienceInfo(experience)
                },
                buildSynthesis(experience, 'experience')
            ]
        }
    });
}

export const buildExperienceInfo = (experience: Experience): RawContent => {
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

export const buildSynthesis = (obj: any, dataType: string):FileDesc => {
    return {
        name: 'synthesis.json',
        isDirectory: false,
        content: {
            type: 'json',
            data: JSON.stringify(obj),
            dataType
        } as JsonContent
    }
}