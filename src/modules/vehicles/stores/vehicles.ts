import { Acl } from "@/acl";
import { vehiclesRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { useDatabaseList } from "@/utils/store/vuefire";
import { defineStore } from "pinia";
import { computed } from "vue";
import { VueDatabaseDocumentData } from "vuefire";
import { Vehicle } from "../models/Vehicle";

export const useVehiclesStore = defineStore("vehicles", () => {
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
