'use client'

import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}