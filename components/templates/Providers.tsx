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
import { DHI_SESSION } from '@utils'

const authLink = setContext((_, { headers }) => {
  const cookies = new Cookies()
  const session = cookies.get(DHI_SESSION)
  return {
    headers: {
      ...headers,
      authorization: session ? `Bearer ${session.access_token}` : '',
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
