import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import type { EntityManager } from "typeorm"

type TransactionalOperations = (events: AuditLogEvent[], entityManager: EntityManager) => Promise<void>

export default TransactionalOperations
