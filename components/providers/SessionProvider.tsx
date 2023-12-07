'use client'

import { SessionProvider, useSession } from "next-auth/react"

export default function Provider({children}: {children: React.ReactNode}) {

  const {data: session} = useSession()

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}