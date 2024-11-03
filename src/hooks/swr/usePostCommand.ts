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
    let json = await response.json();
    if (!response.ok) {
        throw new Error(json.error);
    }
    return json;
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