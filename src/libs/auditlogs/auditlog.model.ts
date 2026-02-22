export interface AuditLogDto {
    userId: string
    businessId: string
    action: string
    description: string
    createdAt: string
}

export interface AuditLog extends AuditLogDto {
    id: string
}
