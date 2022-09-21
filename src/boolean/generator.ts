import { intOf } from "../random";

export function generator(): () => boolean {
    return () => [true, false][intOf(1)]
}