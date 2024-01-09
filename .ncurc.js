const semver = new RegExp(
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
) // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string

/*
  Pinned:
  - styled-components
    - Conflict with GDS

  Skipped:
  - next
    - 13.4.13 causes failures with fetch
*/
const pinned = ["styled-components", "date-fns"]
const ignored = []
const skipped = [{ package: "next", version: "13.4.13" }]

module.exports = {
  target: (package) => {
    if (pinned.some((pin) => pin === package)) {
      const res = "minor"
      console.log(` ${package} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  },

  filterResults: (package, { upgradedVersion }) => {
    if (ignored.some((ignore) => ignore.package === package)) {
      return
    } else if (skipped.some((skip) => skip.package === package && skip.version === upgradedVersion)) {
      return
    }
    return true
  }
}
