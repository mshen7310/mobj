
export type Path = symbol | string | number | ((x: any) => any);

export enum PatternType {
    Generator = 'Generator',
    Matcher = 'Matcher'
}
export const patternArguments: unique symbol = Symbol.for('patternArguments')
export const patternConstructor: unique symbol = Symbol.for('patternConstructor')
export const patternType: unique symbol = Symbol.for('patternType')

