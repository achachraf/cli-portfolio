const TextualOutput: React.FC<ReturnLine> = (returnLine: ReturnLine) => {
    const {text}: TextualContent = returnLine.value as TextualContent;
    return <>
        {!returnLine.isOutput && (<><span className="text-green-700">user@portfolio</span>{':'}<span className="text-blue-400">{returnLine.context?.path}</span><span className="font-bold">$</span>&nbsp;</>)}
        {text.includes('\n') ? text.split('\n').map((line, index) => (<span key={index}>{line}<br /></span>)) : returnLine.value}
    </>
    
};


export default TextualOutput;
