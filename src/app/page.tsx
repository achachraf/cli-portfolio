'use client';

import React, {useMemo, useState} from 'react';
import OutputFactory from '@/components/output/OutputFactory';
import {useInputHandler} from '@/hooks/useInputHandler';
import {useOutput} from '@/hooks/useOutput';
import {useContextPath} from '@/hooks/useContextPath';
import {useCommandExecutor} from '@/hooks/useCommandExecutor';
import {useDelayedDisplay} from '@/hooks/useDelayedDisplay';
import {useInputHistory} from "@/hooks/useInputHistory";
import {useSuggestions} from "@/hooks/useSuggestions";
import {useSpecialCommands} from "@/hooks/useSpecialCommands";
import {useCheckEnv} from '@/hooks/useCheckEnv';
import {useInputRef} from "@/context/InputRefContext";
import {useGetUsername} from '@/hooks/swr/useGetUsername';

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
  const { input, setInput, handleInputChange, handleEnterKey } = useInputHandler(setOutput);
  const { history, setHistory, setHistoryIndex, handleArrowKey } = useInputHistory(input, setInput);
  const { context, setContext } = useContextPath();
  const { executeCommand } = useCommandExecutor(input, setInput, context, setContext, setOutput, history, setHistory, setHistoryIndex);
  const {handleTabKey} = useSuggestions(context, setOutput, input, setInput);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const { showUserInput } = useDelayedDisplay(setShowDocumentation);
  const {handleCtrlC} = useSpecialCommands(setOutput, setInput, input, context);
  const {isEnvReady, loading, checkEnv} = useCheckEnv();
  const {username, isUserLoading} = useGetUsername();
  const inputRef = useInputRef();

  useMemo(() => {
      checkEnv()
  }, []);


  const renderedOutput = useMemo(() => output.map((line, index) => (
      <p key={index}>
        {!line.isOutput && (<><span className="text-green-700">{username}@portfolio</span>{':'}<span className="text-blue-400">{line.context?.path}</span><span className="font-bold">$</span>&nbsp;</>)}
        {line.value && <OutputFactory {...line.value as RawContent} />}
      </p>
  )), [output]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleArrowKey(e);
    handleEnterKey(e, executeCommand);
    handleTabKey(e);
    handleCtrlC(e);
  }

  if (loading || isUserLoading) {
    return (
        <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto bg-black flex items-center justify-center">
              <p className="text-white">Loading...</p>
        </div>
    );
  }

  if (!isEnvReady) {
    return (
        <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto bg-black flex items-center justify-center">
              <p className="text-white">Error: cannot load environment</p>
        </div>
    );
  }

  return (
      <div className='min-h-[55vh] max-h-[55vh] overflow-y-auto bg-black' ref={outputContainerRef}>
        {showDocumentation && (<pre className="text-white font-mono font-light">{documentation}</pre>)}
        <div className="bg-black text-white p-6 rounded-b-md h-full relative">
          {renderedOutput}
          {showUserInput && (
              <div className="flex items-center">
                <nobr className="flex-grow"><span className="text-green-700">{username}@portfolio</span>:<span
                    className="text-blue-400">{context}</span><span className="font-bold">$</span>&nbsp;</nobr>
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
  );
}