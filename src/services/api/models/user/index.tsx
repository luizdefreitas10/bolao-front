import { post } from '../../methods/post'

export default async function UserService() {
  async function create(data: IRequestNewUser): Promise<IResponseNewUser> {
    return await post<IResponseNewUser, IRequestNewUser>('/accounts', data)
  }

  async function resendCode(userId: string): Promise<void> {
    await post<IResponseNewUser, { userId: string }>('/resend-code', { userId })
  }

  async function validateCode(userId: string, code: string): Promise<ISession> {
    return await post<ISession, { userId: string; code: string }>(
      '/validate-code',
      { userId, code },
    )
  }

  return {
    create,
    resendCode,
    validateCode,
  }
}
