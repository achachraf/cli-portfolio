import React from 'react';
import TextualOutput from './TextualOutput';
import GraphicalContent from './GraphicalOutput';
import ErrorOutput from './ErrorOutput';


const OutputFactory: React.FC<RawContent|undefined> = (content: RawContent | undefined) => {
  if(content == undefined){
    return <br></br>
  }
  console.log(content);
  console.log(content.type);
  switch (content.type) {
    case 'text' || undefined:
      return <TextualOutput {...content} />;
    case 'json':
      return <GraphicalContent {...content} />;
    default:
      const message = `Unknown content type: ${content.type}`;
      return <ErrorOutput message={message} />;
  }
};

export default OutputFactory;