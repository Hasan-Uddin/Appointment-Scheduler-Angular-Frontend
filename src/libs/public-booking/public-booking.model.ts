export interface PublicEventType {
    id: string
    userId: string
    name: string
    slug: string
    description?: string
    durationMinutes: number
    color?: string
    hostName: string
    hostEmail: string
    hostTimeZone?: string
}

export interface AvailableDay {
    date: string  // YYYY-MM-DD
    hasSlots: boolean
    slotsCount: number
}

export interface TimeSlot {
    startTime: string  // ISO string
    endTime: string
    isAvailable: boolean
}

export interface CreatePublicBookingRequest {
    eventTypeId: string
    guestName: string
    guestEmail: string
    guestPhone?: string
    startTime: string
    notes?: string
}

export interface BookingConfirmation {
    id: string
    confirmationCode: string
    eventTypeName: string
    hostName: string
    guestEmail: string
    startTime: string
    endTime: string
    durationMinutes: number
    meetingLink?: string
}