'use client'

import { graphqlClient } from '@/src/graphql/gql.setup'
import { ApolloProvider } from '@apollo/client'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={graphqlClient}>
      <SessionProvider>
        <NextUIProvider>
          <NextThemeProvider attribute='class' defaultTheme='dark'>
            {children}
          </NextThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </ApolloProvider>
  )
}