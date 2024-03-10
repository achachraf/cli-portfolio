import Image from 'next/image';

const ExperiencesOutput = (experiences: Experience[]) => {
    return (
        <div className="container mx-auto my-8">
            <h1 className="text-3xl font-semibold mb-6">My Experiences</h1>
            {experiences.map((experience, index) => (
                   <div key={index} className="bg-black p-4 rounded-md shadow-md mb-4 flex items-center">
                       <div className="flex-1">
                         <div className="flex items-center mb-2">
                           <span className="bg-red-500 rounded-full h-3 w-3 mr-2"></span>
                           <span className="text-white text-sm">{experience.startDate} - {experience.endDate}</span>
                         </div>
                         <h3 className="text-white text-xl font-semibold mb-2">{experience.position}</h3>
                         <p className="text-gray-400 mb-2">{experience.company}</p>
                         <p className="text-gray-400 mb-4">{experience.description}</p>
                         <div className="flex space-x-4">
                           <span className="text-gray-500">Name: {experience.name}</span>
                         </div>
                       </div>
                       {experience.logo && (
                         <div className="ml-4 flex-[2_2_0%]">
                           <Image
                             src={experience.logo}
                             alt={`${experience.name} Logo`}
                             width={120}
                             height={80}
                             objectFit="cover"
                             className="rounded-md"
                           />
                         </div>
                       )}
                 </div>
            ))}
        </div>
    );
};

export default ExperiencesOutput;