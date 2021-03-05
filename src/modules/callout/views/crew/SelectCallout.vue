<template>
  <CrewPage page-title="Einsatz auswählen">
    <v-card :loading="loadingCallouts">
      <v-card-text v-if="loadingCallouts"> Lade Einsätze... </v-card-text>

      <template v-else>
        <v-list v-if="items && items.length > 0">
          <v-list-item
            v-for="callout in items"
            :key="callout.id"
            two-line
            @click="next(callout.id)"
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
        <v-btn :disabled="loadingCallouts" text @click="showUserConfirm = true">
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
            <v-btn text @click.stop="showUserConfirm = false">
              Abbrechen
            </v-btn>
            <v-spacer />
            <v-btn text @click="onUserConfirm"> Neuer Einsatz </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </CrewPage>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";

export default {
  components: { CrewPage },
  mixins: [CalloutGroupMixin],

  data() {
    return {
      showUserConfirm: false,
    };
  },

  computed: {
    ...mapState("callouts", { loadingCallouts: "loading" }),
    ...mapGetters("callouts", ["calloutsReversed", "calloutsOfToday"]),
    ...mapGetters("auth", ["isAdmin"]),

    items() {
      if (this.isAdmin) {
        return this.calloutsReversed;
      } else {
        return this.calloutsOfToday;
      }
    },
  },

  methods: {
    onUserConfirm() {
      this.showUserConfirm = false;
      this.next();
    },
  },
};
</script>
