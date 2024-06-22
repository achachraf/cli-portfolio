import Image from 'next/image';
import DetailedExperience from './DetailedExperience';

const ExperiencesOutput = ({experiences}:{experiences: Experience[]}) => {
    return (
        <div className="container mx-auto my-8">
            <h1 className="text-3xl font-semibold mb-6">My Experiences</h1>
            {experiences.map((experience, index) => (
                <DetailedExperience key={index} experience={experience} />
            ))}
        </div>
    );
};

export default ExperiencesOutput;