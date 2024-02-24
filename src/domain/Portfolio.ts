type Portfolio = {
    name: string;
    lastName: string;
    title: string;    
    projects: Project[];
    experiences: Experience[];
}

type Project = {
    name: string;
    description: string;
    links: Link[];
    tasks: Task[];
    logo?: string;
}

type Link = {
    name: string;
    url: string;
}

type Task = {
    name: string;
    description: string;
    status: string;
    technologies: string[];
}

type Experience = {
    name: string;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
    logo?: string;
}

