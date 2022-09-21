const RandExp = require('randexp');

export function generate(pattern: RegExp | string): () => string {
    let g = new RandExp(pattern)
    return () => g.gen()
}


