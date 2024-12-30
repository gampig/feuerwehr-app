import { DatabaseReference, Query } from "firebase/database";
import { MaybeRefOrGetter } from "vue";
import {
  useDatabaseObject as useVuefireDatabaseObject,
  useDatabaseList as useVuefireDatabaseList,
  UseObjectOptions,
  _RefDatabase,
  VueDatabaseDocumentData,
  VueDatabaseQueryData,
} from "vuefire";
import { useErrorHandler } from "./handleError";

export function useDatabaseObject<T>(
  reference: MaybeRefOrGetter<DatabaseReference | null | undefined>,
  options?: UseObjectOptions<T>
): _RefDatabase<VueDatabaseDocumentData<T> | undefined> {
  const data = useVuefireDatabaseObject<T>(reference, options);
  useErrorHandler(data.error);
  return data;
}

export function useDatabaseList<T>(
  reference: MaybeRefOrGetter<DatabaseReference | Query | null | undefined>,
  options?: UseObjectOptions<T>
): _RefDatabase<VueDatabaseQueryData<T>> {
  const data = useVuefireDatabaseList<T>(reference, options);
  useErrorHandler(data.error);
  return data;
}
