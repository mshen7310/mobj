export type Matcher = (x?: any) => boolean

export class Environment {
    private readonly registry = new Map<string, Matcher>()
}