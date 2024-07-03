'use server'

import { handleAxiosError } from '@/services/api/error'
import SessionService from '@/services/api/models/session'
import UserService from '@/services/api/models/user'

export async function createSession(data: ILogin): Promise<ISession> {
  try {
    const { create } = await SessionService()
    const response = await create(data)
    return {
      isError: false,
      access_token: response.access_token,
      phone: response.phone,
      userId: response.userId,
    }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}

export async function resendCode(
  userId: string,
): Promise<{ isError: boolean; error?: string }> {
  try {
    const { resendCode } = await UserService()
    await resendCode(userId)
    return {
      isError: false,
    }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}

export async function validateCode(
  userId: string,
  code: string,
): Promise<ISession> {
  try {
    const { validateCode } = await UserService()
    const response = await validateCode(userId, code)
    return {
      isError: false,
      access_token: response.access_token,
    }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}
