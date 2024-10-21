
import { auth } from '@clerk/nextjs/server'

export const checkRole = (role: unknown) => {
  const { sessionClaims } = auth()
  return (sessionClaims?.userId as { role: string }).role === role
}