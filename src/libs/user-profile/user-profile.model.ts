export interface UserProfileDto {
    id: string
    email: string
    fullName: string
    phone: string
    isEmailVerified: boolean
    isMFAEnabled: boolean
    status: number
    countryId: string
    regionId: string
    districtId: string
    subDistrictId: string
    address: string
    createdAt: string
    updatedAt: string
    role?: number
}

export interface UserProfile extends UserProfileDto {}
