import { useState, useCallback, useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useDebounce } from "./use-debounce";

export const useSearchAddress = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  const groupByType = useCallback(
    (data) => {
      return data.reduce((acc, item) => {
        const { raw } = item;
        const rawData = raw; // assuming raw is any object
        const type = rawData.class;

        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {});
    },
    []
  );

  const handleSearch = (value) => {
    setQuery(value);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length > 2) {
        setLoading(true);
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: debouncedQuery });
        setResults(groupByType(results));
        setLoading(false);
      } else {
        setResults({});
      }
    };

    fetchResults();
  }, [debouncedQuery, groupByType]);

  return {
    query,
    results,
    loading,
    handleSearch,
    selectedItem,
    setSelectedItem,
  };
};
