import React, {useEffect, useState} from "react";

export const useInputHistory = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
) => {
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);



    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('history', JSON.stringify(history));
        }
    }, [history]);


    useEffect(() => {
        const storedHistory = localStorage.getItem('history');
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            setHistory(parsedHistory);
            setHistoryIndex(parsedHistory.length);
        }
    }, []);


    const handleArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            setHistoryIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === 'ArrowDown') {
            setHistoryIndex((prevIndex) => Math.min(prevIndex + 1, history.length));
        }
    };

    useEffect(() => {
        if (historyIndex === history.length) {
            setInput('');
        } else {
            setInput(history[historyIndex]);
        }
    }, [historyIndex]);

    return {
        history,
        setHistory,
        historyIndex,
        setHistoryIndex,
        handleArrowKey
    };
}