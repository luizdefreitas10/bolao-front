'use server'

import { handleAxiosError } from '@/services/api/error'
import UserService from '@/services/api/models/user'

export async function createUser(
  data: IRequestNewUser,
): Promise<IResponseNewUser> {
  try {
    const { create } = await UserService()
    const response = await create(data)
    return { isError: false, userId: response.userId }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}
