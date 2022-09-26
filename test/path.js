let b = require('../dist/types')
let x = b.PathBuilder()

console.log(x.hello.world[5].kkk['pppp'][Symbol.for('uuu')]())
console.log(x.hello.world[5].kkk['pppp']())