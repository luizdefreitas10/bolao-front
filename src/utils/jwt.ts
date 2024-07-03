import jwt from 'jsonwebtoken'

type TokenProps = {
  sub: string
  role: 'ADMIN' | 'USER'
  iat: number
}

export function decodeToken(token: string): TokenProps | null {
  try {
    const decoded = jwt.decode(token)
    return decoded as TokenProps
  } catch (error) {
    console.error('Failed to decode token', error)
    return null
  }
}
