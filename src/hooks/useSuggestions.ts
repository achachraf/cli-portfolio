import React, {useEffect, useState} from 'react';
import {usePostCommand} from "@/hooks/swr/usePostCommand";

export const useSuggestions = (
    context: string,
    setOutput: React.Dispatch<React.SetStateAction<ReturnLine[]>>,
    input: string,
    setInput: (input: string) => void
) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [lastTabPressTime, setLastTabPressTime] = useState(0);

    const {trigger: postCommand} = usePostCommand();


    useEffect(() => {
        if(suggestions.length > 0) {
            setOutput((prevOutput) => [
                ...prevOutput,
                { value: { type: 'text', data: input }, isOutput: false, context: { path: context } },
                { value: {data: suggestions.join("\n"), type: 'text'}, isOutput: true, context: { path: context } },
            ]);
        }
    }, [suggestions]);



    const handleTabKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const currentTime = new Date().getTime();
            // Check if the time difference between consecutive Tab presses is short (e.g., 300ms)
            if (currentTime - lastTabPressTime < 1000) {
                console.log("fast");
                fetchFilesInCurrentDirectory(input, context).then(files => {
                    console.log({files});
                    setSuggestions(files);
                });
            }
            else{
                console.log("too slow");
                // one tab press: look if there is only one suggestion
                fetchFilesInCurrentDirectory(input, context).then(files => {
                    if(files.length === 1){
                        setInput(input.split(' ').slice(0, -1).join(' ') + ' ' + files[0]);
                    }
                });

            }
            setLastTabPressTime(currentTime);
            // Update the last tab press time

        }
    };

    const fetchFilesInCurrentDirectory = async (input: string, context: string): Promise<string[]> => {
        const request: CommandInput = {
            tool: 'ls',
            params: [],
            context: {
                path: context
            }
        }
        const result = await postCommand(request);
        console.log({input});
        const last = input.split(' ').length > 1 ? input.split(' ').slice(-1)[0] : '';
        console.log({last});
        return result.output?.data?.split('\n')
            .filter((file: string) => file.startsWith(last)) ?? [];

    };

    return {
        suggestions,
        handleTabKey
    };
};