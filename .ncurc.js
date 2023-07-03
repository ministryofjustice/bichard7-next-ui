module.exports = {
  target: (dependencyName) => {
    if (["styled-components"].includes(dependencyName)) {
      const res = "minor"
      console.log(` ${dependencyName} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  }
}
