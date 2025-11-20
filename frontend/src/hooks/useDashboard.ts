import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    retry: 3, // Retry only 3 times on failure
    retryDelay: 1000, // Wait 1 second between retries
    refetchInterval: false, // Disable auto-refresh for now
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  return {
    stats: data?.stats,
    recentRents: data?.recent_rents || [],
    upcomingRents: data?.upcoming_rents || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
