"use client"

import {
  createContext,
  type ReactNode,
  type TransitionStartFunction,
  useContext,
  useTransition,
} from "react"

type QueryNavigationContextValue = {
  isPending: boolean
  startTransition?: TransitionStartFunction
}

const QueryNavigationContext = createContext<QueryNavigationContextValue>({
  isPending: false,
})

export function QueryNavigationProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition()

  return (
    <QueryNavigationContext.Provider value={ { isPending, startTransition } }>
      { children }
    </QueryNavigationContext.Provider>
  )
}

export function useQueryNavigation() {
  return useContext(QueryNavigationContext)
}
