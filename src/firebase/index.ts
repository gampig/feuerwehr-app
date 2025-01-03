import { initializeApp } from "firebase/app";
import config from "./config";
import { child, getDatabase, ref } from "firebase/database";

export const firebaseApp = initializeApp(config);

const db = getDatabase(firebaseApp);

export const connectedRef = ref(db, ".info/connected");

export const remoteSchemaVersionRef = ref(db, "schemaVersion");

export const usersRef = ref(db, "users");
export const userClientsRef = ref(db, "userClients");

export const peopleRef = ref(db, "people");

export const vehiclesRef = ref(db, "vehicles");

export const calloutsRef = ref(db, "callouts");
export const crewRef = ref(db, "crew");

export const clothesRef = ref(db, "clothes");
export const clothesTypesRef = child(clothesRef, "clothingTypes");
export const clothesStorageRef = child(clothesRef, "storage");
export const clothesOrdersRef = child(clothesRef, "orders");

export const appSettingsRef = ref(db, "appSettings");
export const feuerwehrGeraeteRef = child(appSettingsRef, "feuerwehrGeraete");
