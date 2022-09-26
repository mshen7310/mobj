export type PathItem = string | number | symbol | ((p: any) => any)
export type Path = PathItem[]
export function path() {
    let all_path: Path = []
    return new Proxy(() => undefined, {
        apply(_target, _thisArg, _argumentsList) {
            let ret = all_path
            all_path = []
            return ret;
        },
        get(_target, prop, receiver) {
            if (typeof prop === 'symbol') {
                all_path.push(prop)
            } else {
                let i = parseInt(prop)
                all_path.push(isNaN(i) ? prop : i)
            }
            return receiver;
        }
    })
}

export function get(obj: any, ...path: Path): any {
    let [current, ...rest] = path;
    if (obj !== undefined || obj !== null) {
        if (current === undefined) {
            return obj;
        } else if (typeof current === 'function') {
            return get(current(obj), ...rest);
        } else if (typeof obj === 'object') {
            return get(obj[current], ...rest)
        } else if (typeof obj === 'string') {
            return get(obj[current], ...rest)
        }
    }
}
