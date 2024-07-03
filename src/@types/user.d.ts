declare interface INewUser {
  fullName: string
  birthdate: Date
  phone: string
  password: string
  confirmPassword: string
  askTerms: boolean
}

declare interface IRequestNewUser {
  fullName: string
  birthdate: Date
  phone: string
  password: string
}
declare interface IResponseNewUser {
  userId?: string
  error?: string
  isError: boolean
}

declare interface ISendCodeProps {
  code: string
}

declare interface IRecoverPassword {
  phone: string
}

declare interface IResponseSendCodeResetPassword {
  userId?: string
  error?: string
  isError: boolean
}

declare interface IResetPassword {
  code: string
  newPassword: string
  userId?: string
}
