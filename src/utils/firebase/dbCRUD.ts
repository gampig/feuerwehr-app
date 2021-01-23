import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";

type FirebasePayload = { [index: string]: any } & { id: string };
type FirebasePartialPayload = Partial<FirebasePayload>;

export function create(ref: string) {
  return firebaseAction(({ commit }, payload) => {
    return firebase
      .database()
      .ref(ref)
      .push({ ...payload })
      .catch((error) => handleError(commit, error));
  });
}

export function set(ref: string) {
  return firebaseAction(({ commit }, payload: FirebasePayload) => {
    const item: FirebasePartialPayload = { ...payload };
    const key = payload.id;
    delete item["id"];

    // Remove undefined properties
    Object.keys(item).forEach(
      (key) =>
        (item[key] === undefined || item[key] === null) && delete item[key]
    );

    return firebase
      .database()
      .ref(ref)
      .child(key)
      .set(item)
      .catch((error) => handleError(commit, error));
  });
}

export function update(ref: string) {
  return firebaseAction(({ commit }, payload: FirebasePayload) => {
    const item: FirebasePartialPayload = { ...payload };
    const key = payload.id;
    delete item["id"];

    // Remove undefined properties
    Object.keys(item).forEach(
      (key) => item[key] === undefined && delete item[key]
    );

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
