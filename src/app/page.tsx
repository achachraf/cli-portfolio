'use client';

import React, {useMemo, useState} from 'react';
import OutputFactory from '@/components/output/OutputFactory';
import { useInputHandler } from '@/hooks/useInputHandler';
import { useOutput } from '@/hooks/useOutput';
import { useContextPath } from '@/hooks/useContextPath';
import { useCommandExecutor } from '@/hooks/useCommandExecutor';
import { useDelayedDisplay } from '@/hooks/useDelayedDisplay';
import {useInputHistory} from "@/hooks/useInputHistory";
import {useSuggestions} from "@/hooks/useSuggestions";
import {useSpecialCommands} from "@/hooks/useSpecialCommands";

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

  const { output, setOutput, outputContainerRef } = useOutput();
  const { input, setInput, inputRef, handleInputChange, handleEnterKey } = useInputHandler(setOutput);
  const { history, setHistory, setHistoryIndex, handleArrowKey } = useInputHistory(input, setInput);
  const { context, setContext } = useContextPath();
  const { executeCommand } = useCommandExecutor(input, setInput, context, setContext, setOutput, history, setHistory, setHistoryIndex);
  const {handleTabKey} = useSuggestions(context, setOutput, input, setInput);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const { showUserInput } = useDelayedDisplay(setShowDocumentation);
  const {handleCtrlC} = useSpecialCommands(setOutput, setInput, input, context);

  const renderedOutput = useMemo(() => output.map((line, index) => (
      <p key={index}>
        {!line.isOutput && (<><span className="text-green-700">user@portfolio</span>{':'}<span className="text-blue-400">{line.context?.path}</span><span className="font-bold">$</span>&nbsp;</>)}
        {line.value && <OutputFactory {...line.value as RawContent} />}
      </p>
  )), [output]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleArrowKey(e);
    handleEnterKey(e, executeCommand);
    handleTabKey(e);
    handleCtrlC(e);
  }

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
                        onKeyDown={handleKeyDown}
                    />
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}