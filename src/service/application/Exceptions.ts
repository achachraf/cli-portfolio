export class FileNotFoundException extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = 'FileNotFoundException';
    }
}

export class PathIsNotDirectoryException extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = 'PathIsNotDirectoryException';
    }
}