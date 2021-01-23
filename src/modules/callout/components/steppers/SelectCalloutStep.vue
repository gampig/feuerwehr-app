<template>
  <v-card :loading="loading" max-width="500" class="ma-1">
    <v-card-title>
      Einsatz auswählen
      <v-spacer />
      <v-btn @click="reload" icon><v-icon>mdi-reload</v-icon></v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text v-if="loading"> Lade Einsätze... </v-card-text>

    <template v-else>
      <v-list v-if="items && items.length > 0">
        <v-list-item
          v-for="callout in items"
          :key="callout.id"
          @click="selectCallout(callout.id)"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ callout.keyword }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ callout.alarmTime | formatDateTimeFromNow }} ({{
                callout.alarmTime | formatDateTime
              }})
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-text v-else>
        Kein Einsatz aus den letzten 24 Stunden vorhanden
      </v-card-text>
    </template>

    <v-card-actions>
      <v-btn @click="showUserConfirm = true" :disabled="loading" text>
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
          <v-btn @click="onUserConfirm" text> Neuer Einsatz </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import modules from "@/modules";

export default {
  data() {
    return {
      showUserConfirm: false,
    };
  },

  computed: {
    ...mapState("callouts", ["loading"]),
    ...mapGetters("callouts", ["calloutsReversed", "calloutsOfToday"]),

    items() {
      if (process.env.NODE_ENV === "production") {
        return this.calloutsOfToday;
      } else {
        return this.calloutsReversed;
      }
    },
  },

  methods: {
    onUserConfirm() {
      this.showUserConfirm = false;
      this.selectCallout();
    },
    selectCallout: function (calloutId) {
      this.$emit("input", calloutId);
    },

    reload: () => modules.onLogin(),
  },
};
</script>
