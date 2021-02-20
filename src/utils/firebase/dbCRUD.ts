import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";

type FirebasePayload<T> = { [index: string]: T } & { id: string };
type FirebasePartialPayload<T> = Partial<FirebasePayload<T>>;

export function create<T>(ref: string) {
  return firebaseAction(({ commit }, payload: T) => {
    return firebase
      .database()
      .ref(ref)
      .push(payload)
      .catch((error) => handleError(commit, error));
  });
}

export function set<T>(ref: string) {
  return firebaseAction(({ commit }, payload: FirebasePayload<T>) => {
    const item: FirebasePartialPayload<T> = { ...payload };
    const key = payload.id;
    delete item["id"];

    return firebase
      .database()
      .ref(ref)
      .child(key)
      .set(item)
      .catch((error) => handleError(commit, error));
  });
}

export function update<T>(ref: string) {
  return firebaseAction(({ commit }, payload: FirebasePayload<T>) => {
    const item: FirebasePartialPayload<T> = { ...payload };
    const key = payload.id;
    delete item["id"];

    return firebase
      .database()
      .ref(ref)
      .child(key)
      .update(item)
      .catch((error) => handleError(commit, error));
  });
}

export function remove(ref: string) {
  return firebaseAction(({ commit }, id: string) => {
    return firebase
      .database()
      .ref(ref)
      .child(id)
      .remove()
      .catch((error) => handleError(commit, error));
  });
}
