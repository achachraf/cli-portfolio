import React from 'react';

interface ErrorOutputProps {
    message: string;
}

const ErrorOutput: React.FC<ErrorOutputProps> = ({ message }) => {
    return (
        <div>
            <p>Error:</p>
            <p>{message}</p>
        </div>
    );
};

export default ErrorOutput;
