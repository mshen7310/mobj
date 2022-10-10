import { PassivePath } from "./search";

export type Difference = {
    path: PassivePath[]
    expected: any
    actual: any
}
