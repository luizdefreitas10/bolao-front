'use server'

import { handleAxiosError } from '@/services/api/error'
import RecoverPasswordService from '@/services/api/models/recover-password'

export async function resetPasswordValidateCode(phone: string) {
  try {
    const { resetPasswordValidateCode } = await RecoverPasswordService()
    const response = await resetPasswordValidateCode(phone)

    return { isError: false, userId: response.userId }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}

export async function resetPassword(
  code: string,
  newPassword: string,
  userId: string,
) {
  try {
    const { resetPassword } = await RecoverPasswordService()
    await resetPassword(code, newPassword, userId)
    return { isError: false, userId }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}
