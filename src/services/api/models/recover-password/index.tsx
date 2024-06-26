import { post } from '../../methods/post'

export default async function RecoverPasswordService() {
  async function resetPasswordValidateCode(phone: string) {
    const payload = JSON.stringify({ phone })
    return await post<IResponseSendCodeResetPassword, string>(
      '/send-code-reset-password',
      payload,
    )
  }

  async function resetPassword(
    code: string,
    newPassword: string,
    userId: string,
  ) {
    const payload = JSON.stringify({ code, newPassword, userId })
    return await post<null, string>('/reset-password', payload)
  }

  return {
    resetPasswordValidateCode,
    resetPassword,
  }
}
