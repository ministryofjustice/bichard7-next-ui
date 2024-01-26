export function logUiDetails(): void {
  console.clear()
  console.table({
    environment: process.env.NODE_ENV,
    version: process.env.UI_HASH ? process.env.UI_HASH.slice(0, 7) : "local"
  })
}
