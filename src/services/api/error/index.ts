import axios, { AxiosError } from 'axios'

interface CustomError {
  message: string
  statusCode?: number
  details?: any
}

export const handleAxiosError = (error: AxiosError | unknown): CustomError => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(', ')
      : responseMessage || error.message || 'An error occurred'

    return {
      message,
      statusCode: error.response?.status,
      details: error.response?.data,
    }
  }

  return {
    message: (error as Error).message,
  }
}
