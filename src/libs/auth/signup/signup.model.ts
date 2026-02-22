export interface SignUpRequest {
    fullName: string
    phone: string
    email: string
    password: string
}

export interface SignUpResponse {
    id: string
}
