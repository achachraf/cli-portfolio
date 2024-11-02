import React from 'react';
import ProjectsOutput from './project/ProjectsOutput';
import ErrorOutput from './ErrorOutput';
import ExperiencesOutput from './experience/ExperiencesOutput';
import DetailedProject from "@/components/output/project/DetailedProject";
import AboutOutput from './about/AboutOutput';
import DetailedExperience from "@/components/output/experience/DetailedExperience";

const GraphicalOutput: React.FC<RawContent> = (content: RawContent) => {
    const graphicalContent = content as JsonContent;
    let parsedContent;
    if(graphicalContent.parsed !== undefined){
        parsedContent = graphicalContent.parsed;
    }
    else if(graphicalContent.data !== undefined){
        parsedContent = JSON.parse(graphicalContent.data);
    }
    else{
        return null;
    }
    switch(graphicalContent.dataType){
        case 'projects': {
            const projects: Project[] = parsedContent as Project[];
            return <ProjectsOutput projects={projects} />;
        }
        case 'project': {
            const project: Project = parsedContent as Project;
            return <DetailedProject project={project} />;
        }
        case 'experiences': {
            const experiences: Experience[] = parsedContent as Experience[];
            return <ExperiencesOutput experiences={experiences} />;
        }
        case 'experience': {
            const experience: Experience = parsedContent as Experience;
            return <DetailedExperience experience={experience} />;
        }
        case 'about':{
            const about: About = parsedContent as About;
            return <AboutOutput about={about} />;
        }
        default:
            return <ErrorOutput message={`Unknown graphical content type: ${graphicalContent.dataType}`} />;
    }
};

export default GraphicalOutput;