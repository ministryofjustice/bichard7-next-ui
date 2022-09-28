const jwt = require("jsonwebtoken");

export type UserData = {
  exclusionList: string[]
  inclusionList: string[]
  visible_courts: string[],
  visible_forces: string[],
  excluded_triggers: string[],
  groups: string[],
  username: string
}

const tokenSecret = () => process.env.TOKEN_SECRET || "OliverTwist";

const generateBichardJwt = function (user: UserData) {
  const tokenData = {
    userName: user.username,
    exclusionList: user.exclusionList,
    inclusionList: user.inclusionList,
    forenames: "Bichard User",
    surname: "01",
    emailAddress: `${user.username}@example.com`,
    groups: user.groups,
    iat: 1626187368,
    exp: 9999999999,
    iss: "Bichard"
  }
  const token = jwt.sign(tokenData, tokenSecret())
  return token
}

export default generateBichardJwt
