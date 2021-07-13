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

        <v-list-group
          v-if="
            canViewAllCallouts &&
            calloutsBeforeToday &&
            calloutsBeforeToday.length > 0
          "
          v-model="showAllCallouts"
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title> Weitere Einsätze anzeigen </v-list-item-title>
            </v-list-item-content>
          </template>
          <CalloutListItem
            v-for="callout in calloutsBeforeToday"
            :key="callout.id"
            :callout="callout"
            @click="selectCallout(callout.id)"
          />
        </v-list-group>
      </v-list>
    </template>

    <v-card-actions>
      <v-btn :disabled="loading" text @click="showUserConfirm = true">
        Neuer Einsatz
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="showUserConfirm" width="400">
      <v-card>
        <v-card-title>Einsatz wirklich nicht vorhanden?</v-card-title>
        <v-card-text>
          Wenn der Einsatz bereits in der Liste vorhanden ist,
          <br />bitte den vorhandenen Eintrag verwenden!
        </v-card-text>
        <v-card-actions>
          <v-btn text @click.stop="showUserConfirm = false"> Abbrechen </v-btn>
          <v-spacer />
          <v-btn text @click="onUserConfirm"> Neuer Einsatz </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CalloutListItem from "./CalloutListItem";

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
      return this.$store.getters["auth/hasAnyRole"](["ROLE_GROUPLEADER"]);
    },
  },

  methods: {
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
