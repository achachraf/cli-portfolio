import React from 'react';


const OutputFactory: React.FC<ReturnLine> = (returnLine: ReturnLine) => {
  switch (returnLine.type) {
    case 'textual':
      return <TextualOutput {...output} />;
    case 'graphical':
      return <ImageOutput {...output} />;
    default:
      return null;
  }
};

export default OutputRenderer;