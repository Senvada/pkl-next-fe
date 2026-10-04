export class ApiError extends Error {
  status: number
  details?: unknown
  requestId?: string

  constructor(
    message: string,
    status: number = 500,
    details?: unknown,
    requestId?: string
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
    this.requestId = requestId
  }

  static fromResponse(
    status: number,
    data: Record<string, unknown> | null | undefined
  ): ApiError {
    const errorObj = data?.error as Record<string, unknown> | undefined
    const metaObj = data?.meta as Record<string, unknown> | undefined

    const message =
      (typeof data?.message === "string" ? data.message : undefined) ||
      (typeof errorObj?.message === "string" ? errorObj.message : undefined) ||
      (status === 401
        ? "Sesi Anda telah berakhir atau belum terautentikasi."
        : status === 403
        ? "Anda tidak memiliki izin untuk mengakses sumber daya ini."
        : status === 404
        ? "Data yang diminta tidak ditemukan."
        : "Terjadi kesalahan pada server.")

    return new ApiError(
      message,
      status,
      errorObj ?? data,
      typeof metaObj?.request_id === "string" ? metaObj.request_id : undefined
    )
  }
}
