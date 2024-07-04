import { post } from '../../methods/post'

export default async function UserService() {
  async function create(data: IRequestNewUser): Promise<IResponseNewUser> {
    const payload = JSON.stringify(data)
    return await post<IResponseNewUser, string>('/accounts', payload)
  }

  async function resendCode(userId: string): Promise<void> {
    const payload = JSON.stringify({ userId })
    await post<IResponseNewUser, string>('/resend-code', payload)
  }

  async function validateCode(userId: string, code: string): Promise<ISession> {
    const payload = JSON.stringify({ userId, code })
    return await post<IResponseNewUser, string>('/validate-code', payload)
  }

  return {
    create,
    resendCode,
    validateCode,
  }
}
