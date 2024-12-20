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
          <v-list-item-content>
            Kein Einsatz aus den letzten 24 Stunden vorhanden.
          </v-list-item-content>
        </v-list-item>

        <v-list-group v-if="canViewAllCallouts" v-model="showAllCallouts">
          <template #activator>
            <v-list-item-content>
              <v-list-item-title> Weitere Einsätze anzeigen </v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-if="calloutsBeforeToday.length > 0">
            <CalloutListItem
              v-for="callout in calloutsBeforeToday"
              :key="callout.id"
              :callout="callout"
              @click="selectCallout(callout.id)"
            />
          </template>
          <v-list-item v-else>
            <v-list-item-content>
              Keine weiteren Einsätze vorhanden.
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </template>

    <v-card-actions>
      <v-btn :disabled="loading" text @click="showUserConfirm = true">
        Neuer Einsatz
      </v-btn>
    </v-card-actions>

    <BaseConfirmDialog
      v-model="showUserConfirm"
      width="400"
      title="Einsatz wirklich nicht vorhanden?"
      confirm-text="Neuer Einsatz"
      @confirm="onUserConfirm"
    >
      Wenn der Einsatz bereits in der Liste vorhanden ist,
      <br />
      bitte den vorhandenen Eintrag verwenden!
    </BaseConfirmDialog>
  </v-card>
</template>

<script>
import { Acl } from "@/acl";
import { mapActions, mapGetters, mapState } from "vuex";
import CalloutListItem from "./CalloutListItem";
import { useAuthStore } from "@/stores/auth";

export default {
  components: { CalloutListItem },

  data() {
    return {
      showAllCallouts: false,
      showUserConfirm: false,
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
      this.selectCallout();
    },

    selectCallout(calloutId) {
      this.$emit("input", calloutId);
    },
  },
};
</script>
