import React, {useEffect, useRef, useState} from 'react';
import {NanoContent} from "@/domain/NanoContent";

interface NanoOutputProps {
    content: NanoContent;
    onSave: (content: NanoContent, updated: string) => Promise<void>;
    onExit: () => void;
    fullScreen?: boolean;
}

const NanoOutput: React.FC<NanoOutputProps> = ({content, onSave, onExit, fullScreen = false}) => {
    const [text, setText] = useState(content.data ?? '');
    const [statusMessage, setStatusMessage] = useState('Ctrl+S/Ctrl+O save | Ctrl+X exit');
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    useEffect(() => {
        setText(content.data ?? '');
    }, [content.data]);

    const handleSave = async () => {
        if (isSaving) {
            return;
        }
        setIsSaving(true);
        setStatusMessage('Saving...');
        try {
            await onSave(content, text);
            setStatusMessage('Saved');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save';
            setStatusMessage(`Error: ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && ['s', 'o'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            handleSave();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            onExit();
        }
    };

    const header = (
        <div className="text-xs font-mono text-slate-400">{content.filePath}</div>
    );

    const textarea = (
        <textarea
            ref={textareaRef}
            className={`resize-none border border-slate-800 bg-black p-2 text-sm font-mono leading-relaxed text-white outline-none ${
                fullScreen ? 'flex-1 min-h-0' : 'h-[220px]'
            }`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing..."
            spellCheck={false}
        />
    );

    const statusBar = (
        <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono">^O WriteOut  ^X Exit</span>
            <span className="font-mono text-slate-300">{statusMessage}</span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="absolute inset-0 z-30 flex flex-col bg-black p-4 text-slate-100">
                {header}
                <div className="mt-2 flex flex-1 flex-col">{textarea}</div>
                <div className="mt-2">{statusBar}</div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-2 text-slate-100">
            <div className="flex flex-col gap-2">
                {header}
                {textarea}
                {statusBar}
            </div>
        </div>
    );
};

export default NanoOutput;
