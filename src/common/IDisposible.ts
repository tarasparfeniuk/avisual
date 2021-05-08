export const disposeSymbol = Symbol("dispose");

export interface IDisposible {

    [disposeSymbol](): void;
    dispose(): void;
}

export function instanceOfIDisposible(object: any): object is IDisposible {
    
    return disposeSymbol in object;
}