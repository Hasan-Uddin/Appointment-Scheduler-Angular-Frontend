export interface MfaLog {
    id: number
    user_name: string
    login_time: string
    ip_address: string
    device: string
    status: 'success' | 'failed'
}
