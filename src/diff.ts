import { PassivePath, path, search } from "./search";

export type Difference = {
    path: PassivePath[]
    expected: any
    actual: any
}

export function* match(a, b) {
    path(a => a)(search((obj, ctx) => {

    }))()(a)
}