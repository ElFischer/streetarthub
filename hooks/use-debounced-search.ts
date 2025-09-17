import { useState, useEffect, useCallback } from 'react';

export function useDebouncedSearch<T>(
  searchFunction: (term: string) => Promise<T>,
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    async (term: string) => {
      if (!term || term.trim().length === 0) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await searchFunction(term);
        setResults(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [searchFunction]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, debouncedSearch]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    clearResults: () => setResults(null)
  };
}
