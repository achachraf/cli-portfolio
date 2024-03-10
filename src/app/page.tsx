'use client';

import OutputFactory from '@/components/output/OutputFactory';
import {getShortcutCmd, isShortcutCmd} from '@/components/Shortcuts';
import React, {useEffect, useMemo, useRef, useState} from 'react';

export default function Home() {

  const documentation = `
  WELCOME TO ACHRAF'S PORTFOLIO

  COMMANDS:
    h, help        Display this help message
    p, projects     Show all projects directories
    a, about        Show information about me
    e, experiences  Show all experiences directories
    
    For example, to list all projects, you can type "projects" or "p" below and press enter.
`;

  const userPrefix = <span className="text-green-700">user@portfolio</span>;

  const [showUserInput, setShowUserInput] = useState(false);

  const [showDocumentation, setShowDocumentation] = useState(false);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState<ReturnLine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [context, setContext] = useState<string>('~');

  const [history, setHistory] = useState<string[]>([]);

  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const outputContainerRef = useRef<HTMLDivElement>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim() === 'clear') {
        setOutput([]);
        setInput('');
        return;
      }
      await executeCommand();
    }
    if (e.key === 'ArrowUp') {
      if (historyIndex === 0) {
        setHistoryIndex(0);
      }
      else
        setHistoryIndex(prevIndex => prevIndex - 1);
    }
    if (e.key === 'ArrowDown') {
      if (historyIndex === history.length) {
        setHistoryIndex(history.length);
      }
      else
        setHistoryIndex(prevIndex => prevIndex + 1);
    }

  };



  useEffect(() => {
    if (historyIndex === history.length) {
      setInput('');
    }
    else {
      setInput(history[historyIndex]);
    }
  }, [historyIndex]);



  useEffect(() => {
    // Focus on the input element when the component mounts
    inputRef.current?.focus();
  }, []);


  useEffect(() => {
    const delay = setTimeout(() => {
      setShowUserInput(true);
    }, 3000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowDocumentation(true);
    }, 1500);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    scrollToBottom();
    console.log("output changed");
  }, [output]);

  useEffect(() => {
    const history = localStorage.getItem('history');
    if (history) {
      let parsed = JSON.parse(history);
      setHistory(parsed);
      setHistoryIndex(parsed.length)
    }
  }, []);

  useEffect(() => {
    if(history.length > 0 ) {
      localStorage.setItem('history', JSON.stringify(history));
    }
  }, [history]);

  const executeCommand = async () => {
    let toExecute = input;
    if (isShortcutCmd(input)) {
      toExecute = getShortcutCmd(input);
    }
    let cmdResult: RawContent | undefined;
    let ctxResult: CommandContext = { path: context };
    if (input === '') {
      cmdResult = undefined;
    }
    else {
      setHistory(prevHistory => [...prevHistory, input]);
      setHistoryIndex(history.length + 1);
      const request: CommandInput = createCommandInput(toExecute);
      let result: CommandResult;
      try {
        const res = await fetch(`/api/command`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });
        result = await res.json();
      }
      catch (err) {
        const error = err as Error;
        setOutput(prevOutput => [...prevOutput,
          { value: {type:"text", data:input}, isOutput: false, context: { path: context } },
          { value: {type:"text", data:`Error: ${error.message}`}, isOutput: true, context: ctxResult },
        ]);
        return;
      }

      if (result.error) {
        cmdResult = {
          type: 'text',
          data: result.error
        } as RawContent;
      }
      else {
        cmdResult = result.output;
      }
      ctxResult = result.context;
    }
    setOutput(prevOutput => [...prevOutput,
      { value: {type:"text", data:input}, isOutput: false, context: { path: context } },
      { value: cmdResult, isOutput: true, context: ctxResult }
    ]);

    setContext(ctxResult.path);

    setInput('');

  }

  const createCommandInput = (input: string): CommandInput => {
    const sliced = input.trim().split(/\s+/);
    const tool = sliced[0];
    let params: string[] = [];
    if (sliced.length > 1) {
      params = sliced.slice(1);
    }
    return {
      context: { path: context },
      tool,
      params,

    }
  }

  const scrollToBottom = () => {
    // Scroll to the bottom of the output container
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  };


  const renderedOutput = useMemo(() => output.map((line, index) => (
    <p key={index}>
      {!line.isOutput && (<><span className="text-green-700">user@portfolio</span>{':'}<span className="text-blue-400">{line.context?.path}</span><span className="font-bold">$</span>&nbsp;</>)}
      {line.value && <OutputFactory {...line.value as RawContent} />}
    </p>
  )), [output]);

  // @ts-ignore
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Centered Box */}
      <div className=" rounded-lg shadow-md w-3/4 " onClick={() => inputRef.current?.focus()} >
        {/* Browser Window Header */}
        <div className="flex items-center justify-between p-3 bg-slate-300 rounded-t-lg">
          {/* Browser Window Buttons (Red, Yellow, Green) */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        {/* CLI Content */}
        <div className='min-h-[55vh] max-h-[55vh] overflow-y-auto bg-black' ref={outputContainerRef}>
          {/* Documentation */}
          {showDocumentation && (<pre className="text-white font-mono font-light">{documentation}</pre>)}
          <div className="bg-black text-white p-6 rounded-b-md h-full relative">
            {/* CLI Output */}
            {renderedOutput}

            {/* CLI Input with Blinking Cursor */}
            {showUserInput && 
            (<div className="flex items-center">
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
