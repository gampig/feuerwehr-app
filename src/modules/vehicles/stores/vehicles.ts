import { defineStore } from "pinia";
import { Vehicle } from "../models/Vehicle";
import { firebaseApp } from "@/firebase";
import { getDatabase, ref as dbRef } from "firebase/database";
import { VueDatabaseDocumentData } from "vuefire";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { useDatabaseList } from "@/utils/store/vuefire";

export const useVehiclesStore = defineStore("vehicles", () => {
  const db = getDatabase(firebaseApp);
  const vehiclesRef = dbRef(db, "vehicles");
  const vehiclesSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.mannschaftsbuch) ? vehiclesRef : undefined
  );
  const vehicles = useDatabaseList<Vehicle>(vehiclesSource);
  const loading = vehicles.pending;

  function find(id: string): NonNullable<VueDatabaseDocumentData<Vehicle>> {
    return (
      vehicles.value.find((vehicle) => vehicle.id == id) || { id: id, name: id }
    );
  }

  return {
    vehicles,
    loading,

    // Private variables
    vehiclesSource,

    find,
  };
});
