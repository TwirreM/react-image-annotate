export function removeProperty<T extends object, K extends keyof T>(
    obj: T,
    key: K
): Omit<T, K> {
    const { [key]: _, ...rest } = obj;
    return rest;
}

export function removePropertyMutable<T extends object, K extends keyof T>(
    obj: T,
    key: K
): void {
    delete obj[key];
}
