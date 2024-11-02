import useSWRMutation from 'swr/mutation';
import useSWR, {SWRConfiguration} from "swr";

export type UsePostCommandArgs = {
    request?: CommandInput;
    config?: SWRConfiguration<CommandResult, Error>;
}


export const usePostCommand = ({
    request,
    config
}: UsePostCommandArgs) => {
    const fetcher = async () => {
        const response = await fetch('/api/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    };
    const key = !!request ? { request } : null;
    const {
        data,
        error,
        isValidating
    } = useSWR<CommandResult>(key,fetcher,config);
    return {
        data,
        error,
        isValidating
    };
};