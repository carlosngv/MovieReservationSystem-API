export interface APIResponse<T, U> {
    data?: T;
    error?: U;
    success: boolean;
}
