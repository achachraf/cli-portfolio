export const resolveAbsolutePath = (input: CommandInput, userPath: string): string => {
    let path: string;
    if(input.params.length > 0 && !input.params[input.params.length-1].startsWith('-')) {
        path = input.params[input.params.length-1];
    }
    else {
        path = "";
    }
    if(path.startsWith("..")){
        path = path.replace("..", getParentFolder(input.context.path, userPath));
    }
    path = path.replace('./', "");
    if(!path.startsWith('/') && !path.startsWith('~')) {
        path = input.context.path + '/' + path;
    }
    if(path.startsWith('~')) {
        path = path.replace('~', userPath);
    }

    return path;
}

export const splitPath = (input: CommandInput, portfolio: Portfolio): {parent: string, filename: string} => {
    const filePath = input.params[0];
    let usernamePath = "/home/" + portfolio.name.toLowerCase();
    const absPath = resolveAbsolutePath(input, usernamePath);
    const parent = absPath.substring(0, absPath.lastIndexOf('/'));
    const filename = filePath.split('/').pop();
    if(filename === undefined) {
        throw new Error("Invalid file path: "+filePath);
    }
    return {
        parent,
        filename
    }
}


export const getParentFolder = (path: string, userPath: string): string => {
    const pathParts = path.replace("~", userPath).split('/');
    pathParts.pop();
    const result = pathParts.join('/');
    return result === "" ? "/" : result;
}