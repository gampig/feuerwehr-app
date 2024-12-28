import { defineStore } from "pinia";
import { Vehicle } from "../models/Vehicle";
import { firebaseApp } from "@/firebase";
import {
  getDatabase,
  ref as dbRef,
  DatabaseReference,
} from "firebase/database";
import { useDatabaseList, VueDatabaseDocumentData } from "vuefire";
import { shallowRef } from "vue";

export const useVehiclesStore = defineStore("vehicles", () => {
  const db = getDatabase(firebaseApp);
  const vehiclesRef = dbRef(db, "vehicles");
  const vehiclesSource = shallowRef<DatabaseReference>();
  const vehicles = useDatabaseList<Vehicle>(vehiclesSource);
  const loading = vehicles.pending;

  function find(id: string): NonNullable<VueDatabaseDocumentData<Vehicle>> {
    return (
      vehicles.value.find((vehicle) => vehicle.id == id) || { id: id, name: id }
    );
  }

  function bind() {
    vehiclesSource.value = vehiclesRef;
  }

  function unbind() {
    vehiclesSource.value = undefined;
  }

  return { vehicles, loading, find, bind, unbind };
});
