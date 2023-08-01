'use client'

import { AsideProvider, CalendarProvider, GlobalProvider } from '@contexts'
import { CookiesProvider } from 'react-cookie'
import { setContext } from '@apollo/client/link/context'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_DIRECTUS_STATIC_TOKEN
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_DIRECTUS_GRAPHQL,
})

const directusClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const httpLinkSystem = createHttpLink({
  uri: process.env.NEXT_PUBLIC_DIRECTUS_GRAPHQL_SYSTEM,
})

export const directusSystemClient = new ApolloClient({
  link: authLink.concat(httpLinkSystem),
  cache: new InMemoryCache(),
})

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={directusClient}>
    <CookiesProvider>
      <GlobalProvider>
        <CalendarProvider>
          <AsideProvider>{children}</AsideProvider>
        </CalendarProvider>
      </GlobalProvider>
    </CookiesProvider>
  </ApolloProvider>
)

export default Providers
