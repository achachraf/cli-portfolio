'use client';

import { getShortcutCmd, isShortcutCmd } from '@/components/Shortcuts';
import { FileNotFoundException } from '@/service/application/Exceptions';
import { create } from 'domain';
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';

export default function Home() {

  const documentation = `
  WELCOME TO ACHRAF'S PORTFOLIO

  COMMANDS:
    -h, --help         Display this help message
    -p, --projects     Show all projects directories
    -a, --about        Show information about me
    -e, --experiences  Show all experiences directories
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
      if (input === 'clear') {
        setOutput([]);
        setInput('');
        return;
      }
      if (isShortcutCmd(input)) {
        setInput(getShortcutCmd(input));
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
  }, [output]);

  const executeCommand = async () => {
    let cmdResult: RawContent | undefined;
    let ctxResult: CommandContext = { path: context };
    if (input === '') {
      cmdResult = undefined;
    }
    else {
      setHistory(prevHistory => [...prevHistory, input]);
      setHistoryIndex(history.length + 1);
      const request: CommandInput = createCommandInput(input);
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
          { value: {type:"text", text:input}, isOutput: false, context: { path: context } },
          { value: {type:"text", text:`Error: ${error.message}`}, isOutput: true, context: ctxResult },
        ]);
        return;
      }

      if (result.error) {
        cmdResult = {
          type: 'text',
          text: result.error
        } as TextualContent;
      }
      else {
        cmdResult = result.output;
      }
      ctxResult = result.context;
    }
    setOutput(prevOutput => [...prevOutput,
      { value: {type:"text", text:input}, isOutput: false, context: { path: context } },
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



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Centered Box */}
      <div className=" rounded-lg shadow-md w-3/4 " onClick={() => inputRef.current?.focus()} >
        {/* Browser Window Header */}
        <div className="flex items-center justify-between mb-2 p-3 bg-slate-300 rounded-t-lg">
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
            {output.map((line, index) => (
              <p key={index}>
                
            </p>
            ))}

            {/* CLI Input with Blinking Cursor */}
            {showUserInput && 
            (<div className="flex items-center">
              <p><span className="text-green-700">user@portfolio</span>:<span className="text-blue-400">{context}</span><span className="font-bold">$</span>&nbsp;</p>
              <input
                ref={inputRef}
                type="text"
                className="outline-none bg-transparent text-white"
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
