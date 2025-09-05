export function getIn(obj: any, path: (string | number)[]): any {
    if (path.length === 0) return obj;
    const [key, ...rest] = path;
    return getIn(obj[key], rest);
}

export function setIn(obj: any, path: (string | number)[], value: any): any {
    if (path.length === 0) return value;
    const [key, ...rest] = path;

    if (Array.isArray(obj)) {
        const copy = [ ...obj ];
        copy[key as number] = setIn(obj[key as number], rest, value); // Even if it's not a number,
        return copy;
    }

    return {
        ...obj,
        [key]: setIn(obj[key], rest, value),
    };
}
