import React from 'react';
import ProjectsOutput from './ProjectOutput';

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
            return <ProjectsOutput {...projects} />
        }
        default:
            return null;
    }
};

export default GraphicalOutput;