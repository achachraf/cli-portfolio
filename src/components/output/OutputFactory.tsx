import React from 'react';
import TextualOutput from './TextualOutput';
import GraphicalContent from './GraphicalOutput';


const OutputFactory: React.FC<RawContent|undefined> = (content: RawContent | undefined) => {
  if(content == undefined){
    return <br></br>
  }
  switch (content.type) {
    case 'text':
      return <TextualOutput {...content} />;
    case 'json':
      return <GraphicalContent {...content} />;
    default:
      return null;
  }
};

export default OutputFactory;