export const queryConfig = {
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount: number) => {
                if (failureCount < 3) return true;
                return false;
            }
        }
    }
}