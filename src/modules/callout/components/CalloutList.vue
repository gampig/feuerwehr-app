<template>
  <v-card :loading="loading" v-bind="$attrs">
    <slot />

    <v-card-text v-if="loading"> Lade Einsätze... </v-card-text>

    <template v-else>
      <v-list>
        <template v-if="calloutsOfToday && calloutsOfToday.length > 0">
          <CalloutListItem
            v-for="callout in calloutsOfToday"
            :key="callout.id"
            :callout="callout"
            @click="selectCallout(callout.id)"
          />
        </template>
        <v-list-item v-else>
          Kein Einsatz aus den letzten 24 Stunden vorhanden.
        </v-list-item>

        <v-list-group v-if="canViewAllCallouts" v-model="showAllCallouts">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Weitere Einsätze anzeigen" />
          </template>
          <template v-if="calloutsBeforeToday.length > 0">
            <CalloutListItem
              v-for="callout in calloutsBeforeToday"
              :key="callout.id"
              :callout="callout"
              @click="selectCallout(callout.id)"
            />
          </template>
          <v-list-item v-else> Keine weiteren Einsätze vorhanden. </v-list-item>
        </v-list-group>
      </v-list>
    </template>

    <v-card-actions>
      <v-btn :disabled="loading" variant="text" @click="showUserConfirm = true">
        Neuer Einsatz
      </v-btn>
    </v-card-actions>

    <BaseConfirmDialog
      v-model="showUserConfirm"
      width="450"
      title="Einsatz wirklich nicht vorhanden?"
      confirm-text="Neuer Einsatz"
      @confirm="onUserConfirm"
    >
      Wenn der Einsatz bereits in der Liste vorhanden ist,
      <br />
      bitte den vorhandenen Eintrag verwenden!
    </BaseConfirmDialog>

    <CreateDialog v-model="showCreateDialog" @save="onCalloutCreated" />
  </v-card>
</template>

<script lang="ts">
import { Acl } from "@/acl";
import { mapActions, mapGetters, mapState } from "vuex";
import CalloutListItem from "./CalloutListItem.vue";
import CreateDialog from "./CreateDialog.vue";
import { useAuthStore } from "@/stores/auth";

export default {
  components: { CalloutListItem, CreateDialog },

  data() {
    return {
      showAllCallouts: false,
      showUserConfirm: false,
      showCreateDialog: false,
    };
  },

  computed: {
    ...mapState("callouts", ["loading"]),
    ...mapGetters("callouts", ["calloutsBeforeToday", "calloutsOfToday"]),

    canViewAllCallouts() {
      const authStore = useAuthStore();
      return (
        authStore.loggedIn && authStore.hasAnyRole(Acl.alleEinsaetzeAnzeigen)
      );
    },
  },

  methods: {
    ...mapActions("callouts", ["bind"]),

    onUserConfirm() {
      this.showUserConfirm = false;
      this.showCreateDialog = true;
    },

    onCalloutCreated(calloutId: string) {
      this.selectCallout(calloutId);
    },

    selectCallout(calloutId: string) {
      this.$emit("update:model-value", calloutId);
    },
  },
};
</script>
