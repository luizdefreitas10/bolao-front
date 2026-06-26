import { post } from '../../methods/post'

export default async function RecoverPasswordService() {
  async function resetPasswordValidateCode(phone: string) {
    return await post<IResponseSendCodeResetPassword, { phone: string }>(
      '/send-code-reset-password',
      { phone },
    )
  }

  async function resetPassword(
    code: string,
    newPassword: string,
    userId: string,
  ) {
    return await post<
      null,
      { code: string; newPassword: string; userId: string }
    >('/reset-password', { code, newPassword, userId })
  }

  return {
    resetPasswordValidateCode,
    resetPassword,
  }
}
