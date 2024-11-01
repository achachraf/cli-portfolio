import { useState, useEffect, useRef } from 'react';

export const useInputHistory = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedHistory = localStorage.getItem('history');
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            setHistory(parsedHistory);
            setHistoryIndex(parsedHistory.length);
        }
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('history', JSON.stringify(history));
        }
    }, [history]);

    useEffect(() => {
        if (historyIndex === history.length) {
            setInput('');
        } else {
            setInput(history[historyIndex]);
        }
    }, [historyIndex]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, executeCommand: () => void) => {
        if (e.key === 'Enter') {
            if (input.trim() === 'clear') {
                setInput('');
                return;
            }
            executeCommand();
        } else if (e.key === 'ArrowUp') {
            setHistoryIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === 'ArrowDown') {
            setHistoryIndex((prevIndex) => Math.min(prevIndex + 1, history.length));
        }
    };

    return {
        input,
        setInput,
        history,
        setHistory,
        historyIndex,
        setHistoryIndex,
        inputRef,
        handleInputChange,
        handleKeyDown,
    };
};