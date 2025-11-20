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
    refetchInterval: 60000, // Refetch every 60 seconds
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
