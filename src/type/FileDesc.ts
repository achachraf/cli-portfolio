type FileDesc = {
    name: string;
    isDirectory: boolean;
    files?: FileDesc[];
    content?: string;
};