import React from "react";

export const useSpecialCommands = (
    setOutput:  React.Dispatch<React.SetStateAction<ReturnLine[]>>,
    setInput:  React.Dispatch<React.SetStateAction<string>>,
    input: string,
    context: string
) => {

    const handleCtrlC = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log({context});
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            setOutput((prevOutput) => [
                ...prevOutput,
                { value: { type: 'text', data: input }, isOutput: false, context: {path: context}},
                { value: { type: 'text', data: '^C' }, isOutput: true},
            ]);
            setInput('');
        }
    }

    return {
        handleCtrlC
    };
}