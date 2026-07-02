import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  iat: number
  [key: string]: any
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token)
  if (!decoded) return true
  return Date.now() >= decoded.exp * 1000
}

export const getTokenExpiryTime = (token: string): Date | null => {
  const decoded = decodeToken(token)
  if (!decoded) return null
  return new Date(decoded.exp * 1000)
}
