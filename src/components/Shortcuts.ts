export function isShortcutCmd(cmd: string): boolean {
    return shortcutsMap.has(cmd);
}

export function getShortcutCmd(cmd: string): string {
    return shortcutsMap.get(cmd) || '';
}


const shortcutsMap: Map<string, string> = new Map([
    ['-h', 'cat help.txt'],
    ['--help', 'cat help.txt'],
    ['-p', 'cat projectsSynthesis.txt'],
    ['--projects', 'cat projectsSynthesis.txt'],
    ['-e', 'cat experimentsSynthesis.txt'],
    ['--experiments', 'cat experimentsSynthesis.txt'],
    ['-a', 'cat about.txt'],
    ['--about', 'cat about.txt'],
    ['clear', 'clear']
  
]);