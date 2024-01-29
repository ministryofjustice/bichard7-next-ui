export function logUiDetails(): void {
  console.clear()
  console.table({
    environment: process.env.NEXT_PUBLIC_WORKSPACE || "local",
    build: process.env.NEXT_PUBLIC_BUILD || "local"
  })
}
