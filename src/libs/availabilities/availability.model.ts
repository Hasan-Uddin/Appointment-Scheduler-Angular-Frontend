export interface Availability {
    id: string
    userId: string
    dayOfWeek: DayOfWeek
    startTime: string // "09:00"
    endTime: string   // "17:00"
    isActive: boolean
    createdAt: string
    updatedAt?: string
}

export enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
}

export interface AvailabilityDto {
    userId: string
    dayOfWeek: DayOfWeek
    startTime: string
    endTime: string
}

export interface UpdateAvailabilityDto {
    startTime: string
    endTime: string
}

export interface AvailabilityGrouped {
    dayOfWeek: DayOfWeek
    dayName: string
    slots: Availability[]
}