type APIResponse<ErrorType, DataType> = {
    error: ErrorType
    description?: string
    data?: never
} | {
    error?: never
    data: DataType
}

export default APIResponse