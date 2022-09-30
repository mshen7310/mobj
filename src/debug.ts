export function at(level: number = 0): { file: string, line: number, column: number } {
    let e = new Error();
    let s = e.stack.split("\n")[2 + level];
    let match = s.match(/\((.*):(\d+):(\d+)\)$/)
    return {
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3])
    };
}