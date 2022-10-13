const generateCsp = (nonce: string) => {
  console.log(nonce)
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self'; frame-src 'self'; form-action 'self'; object-src 'none'; base-uri 'none'`
}

export default generateCsp
