'use client'

import { graphqlClient } from '@/src/graphql/gql.setup'
import { ApolloProvider } from '@apollo/client'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={graphqlClient}>
      <NextUIProvider>
        <NextThemeProvider attribute='class' defaultTheme='dark'>
          {children}
        </NextThemeProvider>
      </NextUIProvider>
    </ApolloProvider>
  )
}