'use client';

import React, {useMemo, useState} from 'react';
import OutputFactory from '@/components/output/OutputFactory';
import { useInputHistory } from '@/hooks/useInputHistory';
import { useOutput } from '@/hooks/useOutput';
import { useContextPath } from '@/hooks/useContextPath';
import { useCommandExecutor } from '@/hooks/useCommandExecutor';
import { useDelayedDisplay } from '@/hooks/useDelayedDisplay';

export default function Home() {
  const documentation = `
  WELCOME TO ACHRAF'S PORTFOLIO

  COMMANDS:
    h, help           Display this help message
    p, projects       Show all projects directories
    project <name>    Show a specific project given its name
    e, experiences    Show all experiences directories
    experience <name> Show a specific experience given its name
    a, about          Show information about me :)

    For example, to list all projects, you can type "projects" or "p" below and press enter.
`;

  const { input, history, setHistory, setHistoryIndex, inputRef, handleInputChange, handleKeyDown } = useInputHistory();
  const { output, setOutput, outputContainerRef } = useOutput();
  const { context, setContext } = useContextPath();
  const { executeCommand } = useCommandExecutor(context, setContext, setOutput, history, setHistory, setHistoryIndex);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const { showUserInput } = useDelayedDisplay(setShowDocumentation);

  const renderedOutput = useMemo(() => output.map((line, index) => (
      <p key={index}>
        {!line.isOutput && (<><span className="text-green-700">user@portfolio</span>{':'}<span className="text-blue-400">{line.context?.path}</span><span className="font-bold">$</span>&nbsp;</>)}
        {line.value && <OutputFactory {...line.value as RawContent} />}
      </p>
  )), [output]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="rounded-lg shadow-md w-3/4" onClick={() => inputRef.current?.focus()}>
          <div className="flex items-center justify-between p-3 bg-slate-300 rounded-t-lg">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className='min-h-[55vh] max-h-[55vh] overflow-y-auto bg-black' ref={outputContainerRef}>
            {showDocumentation && (<pre className="text-white font-mono font-light">{documentation}</pre>)}
            <div className="bg-black text-white p-6 rounded-b-md h-full relative">
              {renderedOutput}
              {showUserInput && (
                  <div className="flex items-center">
                    <nobr className="flex-grow"><span className="text-green-700">user@portfolio</span>:<span className="text-blue-400">{context}</span><span className="font-bold">$</span>&nbsp;</nobr>
                    <input
                        ref={inputRef}
                        type="text"
                        className="outline-none bg-transparent text-white flex-shrink w-full"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleKeyDown(e,  () =>  executeCommand(input))}
                    />
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}