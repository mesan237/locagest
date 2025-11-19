import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { routeTree } from './routeTree.gen';

// Define the router context type
interface RouterContext {
  isAuthenticated: boolean;
}

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create the router instance
const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
  } as RouterContext,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface RoutesContext {
    isAuthenticated: boolean;
  }
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ isAuthenticated }} />
    </QueryClientProvider>
  );
}

export default App;
