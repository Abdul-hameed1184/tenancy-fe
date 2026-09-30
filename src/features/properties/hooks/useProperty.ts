import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProperty } from "../api";

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id ?? ""),
    queryFn: () => getProperty(id as string),
    enabled: Boolean(id),
  });
}
