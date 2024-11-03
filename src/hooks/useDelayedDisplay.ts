import React, { useEffect } from 'react';

export const useDelayedDisplay = (setShowDocumentation: React.Dispatch<React.SetStateAction<boolean>>) => {

    const [showUserInput, setShowUserInput] = React.useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowUserInput(true);
        }, 3000);

        return () => clearTimeout(delay);
    }, [setShowUserInput]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowDocumentation(true);
        }, 1500);

        return () => clearTimeout(delay);
    }, [setShowDocumentation]);

    return {
        showUserInput,
        setShowUserInput,
    };
};