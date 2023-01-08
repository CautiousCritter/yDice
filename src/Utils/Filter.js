import { useMemo } from "react";

export default function Filter({ query, value, children }) {
  const isVisible = useMemo(() => {
    if (query === "") {
      return true;
    }
    return value?.toLowerCase().indexOf(query?.toLowerCase()) !== -1;
  }, [query, value]);

  return isVisible ? children : null;
}
