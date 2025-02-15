import React, {useState} from 'react';

export const useInputHandler = (
    setOutput: React.Dispatch<React.SetStateAction<ReturnLine[]>>
) => {
    const [input, setInput] = useState('');



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>, executeCommand: (input: string) => void) => {
        if (e.key === 'Enter') {
            if (input.trim() === 'clear') {
                setInput('');
                setOutput([]);
                return;
            }
            executeCommand(input);
        }
    };

    return {
        input,
        setInput,
        handleInputChange,
        handleEnterKey,
    };
};