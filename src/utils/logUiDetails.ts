export function logUiDetails(environment: string = "local", build: string = "local"): void {
  console.clear()
  console.table({
    environment,
    build
  })
}
