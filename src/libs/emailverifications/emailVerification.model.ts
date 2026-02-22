export interface EmailVerification {
    id: bigint
    user_id: bigint
    token: string
    expires_at: string
    verified_at?: string
}
