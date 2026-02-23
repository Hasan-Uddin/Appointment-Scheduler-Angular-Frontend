export interface EventType {
    id: string
    userId: string
    name: string
    slug: string
    description?: string
    durationMinutes: number
    isActive: boolean
    color?: string
    createdAt: string
    updatedAt?: string
}

export interface EventTypeDto {
    name: string
    slug: string
    description?: string
    durationMinutes: number
    color?: string
}

export interface UpdateEventTypeDto {
    name?: string
    description?: string
    durationMinutes?: number
    color?: string
}