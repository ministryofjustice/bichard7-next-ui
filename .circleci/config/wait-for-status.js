module.exports = {
  timeout: 500_000,
  validateStatus: (status) => status === +process.env.STATUS_CODE
}
