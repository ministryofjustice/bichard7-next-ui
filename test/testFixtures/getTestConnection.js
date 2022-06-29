/* eslint-disable */
import { PG_PROMISE_TEST_CONNECTION_NAME } from "./testConfig"
import getConnection from "../../src/lib/getConnection"
/* eslint-disable */

const getTestConnection = () => getConnection(PG_PROMISE_TEST_CONNECTION_NAME)

export default getTestConnection
