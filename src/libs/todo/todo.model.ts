export interface TodoDto {
    userId: number
    title: string
    body: string
}

export interface Todo extends TodoDto {
    id: number
}
