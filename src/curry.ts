
type PartialTuple<T extends any[], E extends any[] = []> =
    T extends [infer CAR, ... infer CDR] ?
    PartialTuple<CDR, [...E, CAR?]> :
    [...E, ...T]
type PartialParameters<FN extends (...args: any[]) => any> = PartialTuple<Parameters<FN>>


type RemainingParameters<P extends any[], E extends any[]> =
    E extends [infer EH, ...infer ET] ?
    (P extends [infer PH, ...infer PT] ?
        (PH extends EH ? RemainingParameters<PT, ET> : never)
        : E)
    : []


export function curry<T extends any[]>(f, arity: number = f.length, ...args: T) {
    return arity <= args.length ? f(...args) : (...argz) => curry(f, arity, ...args, ...argz)
}
