import { useQueryClient } from '@tanstack/react-query'

export function useRetry() {
  const queryClient = useQueryClient()

  const retryAll = () => {
    queryClient.invalidateQueries()
    queryClient.refetchQueries()
  }

  const retryQuery = (queryKey) => {
    queryClient.invalidateQueries({ queryKey })
    queryClient.refetchQueries({ queryKey })
  }

  return { retryAll, retryQuery }
}