type Portfolio = {
    name: string;
    lastName: string;
    title: string;    
    projects: Project[];
    experiences: Experience[];
    about: About;
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

type About = {
    image: string;
    FullName: string;
    title: string;
    description: string;
    skills: string[];
    contact: Contact;
    languages: Language[];
    interests: string[];
}

type Contact = {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    Address: string;
}

type Language = {
    name: string;
    level: string;
}


