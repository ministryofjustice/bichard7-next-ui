export function logUiDetails(): void {
  console.clear()
  console.table({
    environment: process.env.WORKSPACE || "local",
    build: process.env.BUILD || "local"
  })
}
