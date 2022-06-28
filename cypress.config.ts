import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:run", () => {
        config.baseUrl = "http://localhost:8040/ui"
      })
    }
  }
})
