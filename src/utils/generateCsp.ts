// utils/generate-csp.ts
type Directive =
  | "child-src"
  | "connect-src"
  | "default-src"
  | "font-src"
  | "frame-src"
  | "img-src"
  | "manifest-src"
  | "media-src"
  | "object-src"
  | "prefetch-src"
  | "script-src"
  | "script-src-elem"
  | "script-src-attr"
  | "style-src"
  | "style-src-elem"
  | "style-src-attr"
  | "worker-src"
  | "base-uri"
  | "plugin-types"
  | "sandbox"
  | "form-action"
  | "frame-ancestors"
  | "navigate-to"
  | "report-uri"
  | "report-to"
  | "block-all-mixed-content"
  | "referrer"
  | "require-sri-for"
  | "require-trusted-types-for"
  | "trusted-types"
  | "upgrade-insecure-requests"
type Value = string
interface Options {
  devOnly?: boolean
}

interface GenerateCSPProps {
  nonce?: string
}

const generateCSP = ({ nonce }: GenerateCSPProps = {}) => {
  const policy: Partial<Record<Directive, Value[]>> = {}

  // adder function for our policy object
  const add = (directive: Directive, value: Value, options: Options = {}) => {
    if (options.devOnly && process.env.NODE_ENV !== "development") return
    const curr = policy[directive]
    policy[directive] = curr ? [...curr, value] : [value]
  }

  //"default-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self';"

  // CSP
  add("default-src", `'self'`)
  add("frame-src", `'self'`)
  add("frame-ancestors", `'self'`)
  add("form-action", `'self'`)
  add("style-src", `'nonce-${nonce}'`)
  add("style-src", `'unsafe-inline'`, { devOnly: true })

  // return the object in a formatted value (this won't work on IE11 without a polyfill!)
  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ")
}

export default generateCSP
