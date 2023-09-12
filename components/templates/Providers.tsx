'use client'

import { AsideProvider, CalendarProvider, GlobalProvider } from '@contexts'
import { CookiesProvider, Cookies } from 'react-cookie'
import { setContext } from '@apollo/client/link/context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { refreshToken } from '@utils/api'

const authLink = setContext(async (_, { headers }) => {
  const access_token = await refreshToken(new Cookies())
  return {
    headers: {
      ...headers,
      authorization: access_token ? `Bearer ${access_token}` : '',
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

const queryClient = new QueryClient()

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={directusClient}>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <GlobalProvider>
          <CalendarProvider>
            <AsideProvider>{children}</AsideProvider>
          </CalendarProvider>
        </GlobalProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </ApolloProvider>
)

export default Providers
