import React from "react";

const TextualOutput: React.FC<RawContent> = (content: RawContent) => {
    const {data: text}: RawContent = content as RawContent;
    return <>
        {text && (text.includes('\n') ? text.split('\n').map((line, index) => (<span key={index}>{line}<br /></span>)) : text)}
    </>
    
};


export default TextualOutput;
