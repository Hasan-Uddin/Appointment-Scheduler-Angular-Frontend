export interface MfaSetting {
    user_name: string
    method: 'TOTP' | 'SMS' | 'EMAIL'
    secret_key: string | null
    backup_codes: string[] | null
    enabled: boolean
}
