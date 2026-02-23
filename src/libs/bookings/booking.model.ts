export interface BookingDto {
    id: string
    eventTypeName: string
    guestName: string
    guestEmail: string
    startTime: string // ISO date string
    endTime: string // ISO date string
    status: string
    createdAt: string // ISO date string
}

export interface Booking extends BookingDto {}
