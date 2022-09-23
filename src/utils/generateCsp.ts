interface props {
  nonce?: string
}

const generateCSP = ({ nonce }: props = {}) => {
  return `default-src 'none'; script-src-elem 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'`
}

export default generateCSP
