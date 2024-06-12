import { fetcher } from "@zlicx/utils";
import useSWRImmutable from "swr/immutable";
import { UserProps } from "../types";

export default function useUser() {
  const { data, isLoading } = useSWRImmutable<UserProps>("/api/user", fetcher);

  return {
    user: data,
    loading: isLoading,
  };
}
