type APIResponse<ErrorType, DataType> = Promise<{
    error: ErrorType
    description?: string
    data?: never
} | {
    error?: never
    data: DataType
}>

export default APIResponse