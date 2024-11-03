import Image from 'next/image';

const DetailedProject = ({project}:{project: Project}) => {
    return (
        <div>
            <div className="bg-black p-4 rounded-md shadow-md flex items-center">
                {project.logo && (
                    <div className="mr-4">
                        <Image
                            src={project.logo}
                            alt={`${project.name} Logo`}
                            width={150}
                            height={150}
                            style={{objectFit: 'cover'}}
                            className="rounded-md"
                        />
                    </div>
                )}
                <div>
                    <h3 className="text-white text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex space-x-4">
                        {project.links?.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                               className="text-blue-500 hover:underline">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <table className="w-full bg-gray-800 text-white mt-4 rounded-md shadow-md border-collapse">
                <thead>
                <tr>
                    <th className="p-4 text-left border-b">Task</th>
                    <th className="p-4 text-left border-b">Description</th>
                    <th className="p-4 text-left border-b">Status</th>
                    <th className="p-4 text-left border-b">Technologies</th>
                </tr>
                </thead>
                <tbody>
                {project.tasks.map((task, index) => (
                    <tr key={index} className={(index % 2 === 0) ? 'bg-gray-700' : 'bg-gray-800'}>
                        <td className="p-4 border-b">{task.name}</td>
                        <td className="p-4 border-b">{task.description}</td>
                        <td className={`p-4 border-b ${getStatusTextColor(task.status)}`}>
                            {task.status}
                        </td>
                        <td className="p-4 border-b">{task.technologies.join(', ')}</td>
                    </tr>
                ))}
                </tbody>
            </table>


        </div>

    );
}

function getStatusTextColor(status: string) {
    switch (status) {
        case 'In Progress':
            return 'text-yellow-500';
        case 'Done':
            return 'text-green-500';
        case 'Pending':
            return 'text-blue-500';
        default:
            return 'text-white';
    }
}
export default DetailedProject;