export interface ForgotPasswordRequestDto {
    email: string
    newPassword: string
    //confirmPassword: string;
}

export interface ForgotPasswordResponse {
    success: boolean
    message: string
}

export interface ForgotPassword extends ForgotPasswordResponse {
    email: string
}
