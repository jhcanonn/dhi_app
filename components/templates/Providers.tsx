'use client'

import {
  AsideProvider,
  CalendarProvider,
  ClientProvider,
  GlobalProvider,
} from '@contexts'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { CookiesProvider, Cookies } from 'react-cookie'
import { setContext } from '@apollo/client/link/context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
  cache: new InMemoryCache({ addTypename: false }),
})

const httpLinkSystem = createHttpLink({
  uri: process.env.NEXT_PUBLIC_DIRECTUS_GRAPHQL_SYSTEM,
})

export const directusSystemClient = new ApolloClient({
  link: authLink.concat(httpLinkSystem),
  cache: new InMemoryCache({ addTypename: false }),
})

const queryClient = new QueryClient()

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={directusClient}>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <GlobalProvider>
          <CalendarProvider>
            <AsideProvider>
              <ClientProvider>{children}</ClientProvider>
            </AsideProvider>
          </CalendarProvider>
        </GlobalProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </ApolloProvider>
)

export default Providers
