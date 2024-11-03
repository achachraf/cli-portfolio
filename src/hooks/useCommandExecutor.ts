import React from 'react';
import {getShortcutCmd, isShortcutCmd} from '@/components/Shortcuts';
import {usePostCommand} from './swr/usePostCommand';

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

    const {trigger: postCommand} = usePostCommand()
    const executeCommand = async () => {
        let toExecute = input;
        if (isShortcutCmd(input)) {
            toExecute = getShortcutCmd(input);
        }
        let cmdResult: RawContent | undefined;
        let ctxResult: CommandContext = { path: context };
        if (input === '') {
            cmdResult = undefined;
        } else {
            setHistory((prevHistory) => [...prevHistory, input]);
            setHistoryIndex(history.length + 1);
            const request: CommandInput = createCommandInput(toExecute);
            try {
                const result = await postCommand(request)
                if (result.error) {
                    cmdResult = {
                        type: 'text',
                        data: result.error,
                    } as RawContent;
                } else {
                    cmdResult = result.output;
                }
                ctxResult = result.context;
            } catch (err) {
                const error = err as Error;
                setOutput((prevOutput) => [
                    ...prevOutput,
                    { value: { type: 'text', data: input }, isOutput: false, context: { path: context } },
                    { value: { type: 'text', data: `Error: ${error.message}` }, isOutput: true, context: ctxResult },
                ]);
                return;
            }

        }
        setOutput((prevOutput) => [
            ...prevOutput,
            { value: { type: 'text', data: input }, isOutput: false, context: { path: context } },
            { value: cmdResult, isOutput: true, context: ctxResult },
        ]);

        setContext(ctxResult.path);
        setInput('');
    };

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
        };
    };

    return {
        executeCommand,
    };
};