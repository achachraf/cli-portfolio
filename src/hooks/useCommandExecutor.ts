import React, { useState, useEffect } from 'react';
import { getShortcutCmd, isShortcutCmd } from '@/components/Shortcuts';
import { usePostCommand } from './swr/usePostCommand';

export const useCommandExecutor =
    (
        input: string,
        setInput: React.Dispatch<React.SetStateAction<string>>,
        context: string,
        setContext: (path: string) => void,
        setOutput: React.Dispatch<React.SetStateAction<ReturnLine[]>>,
        history: string[],
        setHistory:  React.Dispatch<React.SetStateAction<string[]>>,
        setHistoryIndex: (index: number) => void
    ) => {
    let cmdResult: RawContent | undefined;
    let ctxResult: CommandContext = { path: context };

    const [request , setRequest] = useState<CommandInput>();
    usePostCommand({
        request,
        config: {
            onSuccess: (data) => {
                const { error, output , context } = data || {};
                if ( error ){
                    cmdResult = {
                        type: 'text',
                        data: error,
                    } as RawContent;
                } else {
                    cmdResult = output;
                }
                ctxResult = context;

                setOutput((prevOutput) => [
                    ...prevOutput,
                    { value: { type: 'text', data: input }, isOutput: false, context },
                    { value: cmdResult, isOutput: true, context: ctxResult },
                ]);

                setContext(ctxResult.path);
                setInput('');
            },
            onError: (error) => {
                setOutput((prevOutput) => [
                    ...prevOutput,
                    { value: { type: 'text', data: input }, isOutput: false, context: { path: context } },
                    { value: { type: 'text', data: `Error: ${error.message}` }, isOutput: true, context: ctxResult },
                ]);
            }
        }
    });

    const executeCommand = async () => {
        let toExecute = input;
        if (isShortcutCmd(input)) {
            toExecute = getShortcutCmd(input);
        }

        if (input === '') {
            cmdResult = undefined;
        } else {
            setHistory((prevHistory) => [...prevHistory, input]);
            setHistoryIndex(history.length + 1);
            const request: CommandInput = createCommandInput(toExecute);
            setRequest(request);
        }
    };

    const createCommandInput = (input: string): CommandInput => {
        if (input.endsWith('/')) {
            input = input.slice(0, -1);
        }
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
        };
    };

    return {
        executeCommand,
    };
};