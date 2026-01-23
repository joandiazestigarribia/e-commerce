import { queryConfig } from '@/lib';
import { persistor, store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppRouter } from './router';
import { AuthProvider } from '@/contexts';

// TODO: Revisar
// TODO: Dentro del suspense agregar un spinner

const queryClient = new QueryClient(queryConfig)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <AuthProvider>
            <Suspense fallback={<div>Loading app...</div>}>
              <AppRouter />
            </Suspense>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider >
  )
}

export default App