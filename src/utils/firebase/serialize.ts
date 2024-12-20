import firebase from "firebase/compat/app";
import { isObject } from "@posva/vuefire-core/src/shared";

export default (snapshot: firebase.database.DataSnapshot) => {
  const value = snapshot.val();
  // if the value is a primitive, we create an object instead and assign the .value
  const doc = Object.assign(
    isObject(value) ? value : Object.defineProperty({}, ".value", { value }),
    { id: snapshot.key }
  );

  Object.defineProperty(doc, ".key", { value: snapshot.key });

  return doc;
};
