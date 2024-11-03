import { useState, useEffect, useRef } from 'react';

export const useOutput = () => {
    const [output, setOutput] = useState<ReturnLine[]>([]);
    const outputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (outputContainerRef.current) {
            outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
        }
    }, [output]);

    return {
        output,
        setOutput,
        outputContainerRef,
    };
};