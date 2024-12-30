import { defineStore } from "pinia";
import { useDatabaseObject } from "vuefire";
import { Callout, CalloutRole, CalloutVehicle, Crew } from "../models/Callout";
import { computed, ref } from "vue";
import {
  child,
  ref as dbRef,
  getDatabase,
  remove,
  set,
  update,
} from "firebase/database";
import { firebaseApp } from "@/firebase";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import handleError from "@/utils/store/handleError";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";

export const useCalloutStore = defineStore("callout", () => {
  const selectedCalloutId = ref<string>();
  const selectedVehicleId = ref<string>();

  const db = getDatabase(firebaseApp);

  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.einsaetzeAnzeigen)
  );

  const calloutSource = computed(() =>
    selectedCalloutId.value === undefined || !isAuthorized.value
      ? undefined
      : dbRef(db, "callouts/" + selectedCalloutId.value)
  );
  const callout = useDatabaseObject<Callout>(calloutSource);

  const crewSource = computed(() =>
    selectedCalloutId.value === undefined || !isAuthorized.value
      ? undefined
      : dbRef(db, "crew/" + selectedCalloutId.value)
  );
  const crew = useDatabaseObject<Crew>(crewSource);

  const vehicleSource = computed(() =>
    selectedVehicleId.value === undefined
      ? undefined
      : dbRef(db, "vehicles/" + selectedVehicleId.value)
  );
  const vehicle = useDatabaseObject<Vehicle>(vehicleSource);

  const loading = computed(
    () => callout.pending.value || crew.pending.value || vehicle.pending.value
  );

  function selectCallout(calloutId: string) {
    selectedCalloutId.value = calloutId;
  }

  function selectVehicle(vehicleId: string) {
    selectedVehicleId.value = vehicleId;
  }

  async function updateCallout(newCallout: Callout) {
    if (calloutSource.value === undefined) {
      return Promise.reject("Kein Einsatz ausgewählt");
    }
    try {
      const callout = deleteUndefinedProperties(newCallout);
      return await update(calloutSource.value, callout);
    } catch (error) {
      return handleError(error);
    }
  }

  async function updateVehicleDetails(details: CalloutVehicle) {
    if (
      calloutSource.value === undefined ||
      selectedVehicleId.value === undefined
    ) {
      return Promise.reject("Kein Einsatz und/oder Fahrzeug ausgewählt");
    }
    try {
      return await update(
        child(calloutSource.value, "vehicles/" + selectedVehicleId.value),
        deleteUndefinedProperties(details)
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async function addCrewMember(personId: string) {
    return await updateRole(personId, true);
  }

  async function addStandbyMember(personId: string) {
    if (crewSource.value === undefined) {
      return Promise.reject("Kein Einsatz ausgewählt");
    }
    try {
      return await set(
        child(child(crewSource.value, "standby"), personId),
        true
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async function updateRole(personId: string, role: CalloutRole | boolean) {
    if (
      crewSource.value === undefined ||
      selectedVehicleId.value === undefined
    ) {
      return Promise.reject("Kein Einsatz und/oder Fahrzeug ausgewählt");
    }
    try {
      return await set(
        child(
          child(crewSource.value, "vehicles/" + selectedVehicleId.value),
          personId
        ),
        role
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async function removeCrewMember(personId: string) {
    if (
      crewSource.value === undefined ||
      selectedVehicleId.value === undefined
    ) {
      return Promise.reject("Kein Einsatz und/oder Fahrzeug ausgewählt");
    }
    try {
      return await remove(
        child(
          child(crewSource.value, "vehicles/" + selectedVehicleId.value),
          personId
        )
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async function removeStandbyMember(personId: string) {
    if (crewSource.value === undefined) {
      return Promise.reject("Kein Einsatz ausgewählt");
    }
    try {
      return await remove(child(child(crewSource.value, "standby"), personId));
    } catch (error) {
      return handleError(error);
    }
  }

  async function deleteSelectedCallout() {
    if (calloutSource.value === undefined || crewSource.value === undefined) {
      return Promise.reject("Kein Einsatz ausgewählt");
    }
    try {
      await Promise.all([
        remove(calloutSource.value),
        remove(crewSource.value),
      ]);
      selectedCalloutId.value = undefined;
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    callout,
    crew,
    vehicle,
    loading,

    // Private variables
    selectedCalloutId,
    selectedVehicleId,
    isAuthorized,
    calloutSource,
    crewSource,
    vehicleSource,

    selectCallout,
    selectVehicle,
    addCrewMember,
    addStandbyMember,
    updateRole,
    removeCrewMember,
    removeStandbyMember,
    updateCallout,
    updateVehicleDetails,
    deleteSelectedCallout,
  };
});
