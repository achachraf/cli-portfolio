export function isShortcutCmd(cmd: string): boolean {
    return shortcutsMap.has(cmd.split(' ')[0].trim());
}

export function getShortcutCmd(cmd: string): string {
    let key = cmd.split(' ')[0];
    if (!shortcutsMap.has(key)) {
        return '';
    }
    return shortcutsMap.get(key)!(cmd.split(' ').slice(1));
}


const shortcutsMap: Map<string, (args:string[]) => string> = new Map([
    ['h', () => 'cat help.txt'],
    ['help', () => 'cat help.txt'],
    ['p', () => 'display /home/achraf/projects/synthesis.json'],
    ['projects', () =>  'display /home/achraf/projects/synthesis.json'],
    ['project', (args:string[]) => `display /home/achraf/projects/${args[0]}/synthesis.json`],
    ['e', () => 'display /home/achraf/experiences/synthesis.json'],
    ['experiences', () => 'display /home/achraf/experiences/synthesis.json'],
    ['experience', (args:string[]) => `display /home/achraf/experiences/${args[0]}/synthesis.json`],
    ['a', () => 'display /home/achraf/about/synthesis.json'],
    ['about', () => 'display /home/achraf/about/synthesis.json'],
    ['clear', () => 'clear']
  
]);