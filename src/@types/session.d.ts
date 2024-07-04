declare interface ILogin {
  phone: string
  password: string
}

declare interface ISession {
  access_token?: string
  error?: string
  isError: boolean
  userId?: string
  phone?: string
}
