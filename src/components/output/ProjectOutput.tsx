import React from 'react';
import Image from 'next/image';

const ProjectsOutput: React.FC<Project[]> = (projects: Project[]) => {
    console.log(projects);
    return (
        <div className="flex flex-col space-y-4">
            {projects.map((project, index) => (
                  <div className="bg-black p-4 rounded-md shadow-md flex items-center">
                  {project.logo && (
                    <div className="mr-4">
                      <Image
                        src={project.logo}
                        alt={`${project.name} Logo`}
                        width={150}
                        height={150}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex space-x-4">
                      {project.links?.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
            ))}
        </div>
    );
}

export default ProjectsOutput;
