/*
  Pinned packages:

  - styled-components@5 
    - conflict with GDS as of June 2023
 
  - @typescript-eslint/eslint-plugin@5
  - @typescript-eslint/parser@5
    - eslint-config-airbnb-typescript@17 requires these two packages @5
*/
const pinned = ["styled-components", "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"]

module.exports = {
  target: (dependencyName) => {
    if (pinned.includes(dependencyName)) {
      const res = "minor"
      console.log(` ${dependencyName} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  }
}
