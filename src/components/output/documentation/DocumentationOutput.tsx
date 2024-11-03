const DocumentationOutput = ({ documentation }: { documentation: Documentation }) => {
    return (
        (<pre className="text-white font-mono font-light">{documentation.text}</pre>)
    );
}

export default DocumentationOutput;