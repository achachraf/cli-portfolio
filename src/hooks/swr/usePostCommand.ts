import useSWRMutation from 'swr/mutation';

// Define the fetcher for the SWR mutation hook
const fetcher = async (url: string, { arg: command }: {arg: CommandInput}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};

export const usePostCommand = () => {
    const { trigger, data, error, isMutating } = useSWRMutation<CommandResult, Error, string, CommandInput>('/api/command', fetcher);
    return {
        trigger, // function to call the API with command input
        data,
        error,
        isMutating,
    };
};