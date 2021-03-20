import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Action } from "vuex";

type FirebasePayload = { id: string };
type FirebasePartialPayload = Partial<FirebasePayload> & { [key: string]: any };

type PreprocessCallback<Payload> = (payload: Payload) => Payload;

export default class<State, Payload extends FirebasePayload> {
  ref: string;
  constructor(ref: string) {
    this.ref = ref;
  }

  makeCreate(
    preprocessCallback: PreprocessCallback<Payload> = (payload) => payload
  ) {
    return <Action<State, any>>(({ commit }, payload: Payload) => {
      return firebase
        .database()
        .ref(this.ref)
        .push(preprocessCallback({ ...payload }))
        .catch((error) => handleError(commit, error));
    });
  }

  makeSet(
    preprocessCallback: PreprocessCallback<Payload> = (payload) => payload
  ) {
    return <Action<State, any>>(({ commit }, payload: Payload) => {
      const key = payload.id;
      const item = this.processPayload(preprocessCallback({ ...payload }));

      return firebase
        .database()
        .ref(this.ref)
        .child(key)
        .set(item)
        .catch((error) => handleError(commit, error));
    });
  }

  makeUpdate(
    preprocessCallback: PreprocessCallback<Payload> = (payload) => payload
  ) {
    return <Action<State, any>>(({ commit }, payload: Payload) => {
      const key = payload.id;
      const item = this.processPayload(preprocessCallback({ ...payload }));

      return firebase
        .database()
        .ref(this.ref)
        .child(key)
        .update(item)
        .catch((error) => handleError(commit, error));
    });
  }

  makeRemove() {
    return <Action<State, any>>(({ commit }, id: string) => {
      return firebase
        .database()
        .ref(this.ref)
        .child(id)
        .remove()
        .catch((error) => handleError(commit, error));
    });
  }

  /**
   * Transforms an item for Firebase
   * @param payload the item to be transformed; the object will be modified, so only pass in a copy
   * @returns the transformed item
   */
  private processPayload(payload: Payload): FirebasePartialPayload {
    const item: FirebasePartialPayload = payload;
    delete item["id"];

    // Remove undefined properties
    Object.keys(item).forEach(
      (key) =>
        (item[key] === undefined || item[key] === null) && delete item[key]
    );

    return item;
  }
}
