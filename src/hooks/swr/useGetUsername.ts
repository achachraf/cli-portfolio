import useSWR from "swr";

export const useGetUsername = () => {

    const fetcher = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return response.json();
    };

    const { data, error ,isLoading } = useSWR<{name: string}>(`/api/user?field=name`, fetcher);

    const username = (data !== undefined ? data.name : "user").toLowerCase();

    return {
        username,
        isUserLoading: isLoading,
        userError: error,
    };
}