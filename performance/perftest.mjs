import * as L from "../dist/index.js"

const id = (x) => x
const root = L.bus()
const view = L.view(root, id, id, id, id, id, id, id, id, id, id, id, id)
view.forEach((x) => {})

const rounds = 1000000
const start = new Date().getTime()
for (let i = 0; i < rounds; i++) {
  root.push("HELLO")
}
const now = new Date().getTime()
const elapsed = now - start
const roundsPerMillis = rounds / elapsed
console.log("RPM", roundsPerMillis)
