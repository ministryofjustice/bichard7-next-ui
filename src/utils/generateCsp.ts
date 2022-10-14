const generateCsp = (nonce: string) => {
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' 'unsafe-inline'; frame-src 'self'; form-action 'self'; object-src 'none'; base-uri 'none'`
}

export default generateCsp
