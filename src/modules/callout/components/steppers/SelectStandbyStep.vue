<template>
  <v-card class="ma-1" :loading="loadingCallout">
    <v-card-title>Bereitschaft</v-card-title>
    <v-card-subtitle v-if="callout">
      {{ callout.keyword }} -
      {{ callout.alarmTime | formatDateTimeFromNow }}
      ({{ callout.alarmTime | formatDateTime }})
    </v-card-subtitle>

    <v-divider v-if="callout"></v-divider>

    <v-card-text v-if="callout">
      <PersonAutocomplete
        :items="peopleWithoutCrew"
        :loading="loading"
        @input="onAdd"
      ></PersonAutocomplete>

      <transition-group name="list" tag="div">
        <v-chip
          v-for="(val, person) in crew"
          :key="person + 0"
          color="secondary"
          class="ma-1"
          close
          @click:close="onRemove(person)"
          >{{ person }}</v-chip
        >
      </transition-group>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn text @click="back"> Zurück </v-btn>
      <v-spacer />
      <v-btn color="primary" @click="showDoneNotice = true">Fertig</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDoneNotice" max-width="700">
      <v-card>
        <v-card-title>
          Bitte dieses Programm (FeuerwehrApp) schließen.
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDoneNotice = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <BaseConfirmDialog
      v-model="showRemoveDialog"
      confirm-text="Entfernen"
      @confirm="onRemoveConfirmed"
    >
      Soll <strong>{{ personToRemove }}</strong> wirklich vom Einsatz entfernt
      werden?
    </BaseConfirmDialog>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import PersonAutocomplete from "../form/PersonAutocomplete";

export default {
  components: { PersonAutocomplete },

  data() {
    return {
      loading: false,
      showDoneNotice: false,
      showRemoveDialog: false,
      personToRemove: null,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout", loadingCallout: "loading" }),
    ...mapGetters("people", ["peopleWithoutCrew"]),
    ...mapGetters("callout", { crew: "standbyCrew" }),
  },

  methods: {
    ...mapActions("callout", {
      addStandbyMember: "addStandbyMember",
      removeStandbyMember: "removeStandbyMember",
    }),

    onAdd(item) {
      this.loading = true;
      const personId = item.id;

      this.addStandbyMember(personId).finally(() => {
        this.loading = false;
      });
    },

    onRemove(item) {
      this.personToRemove = item;
      this.showRemoveDialog = true;
    },

    onRemoveConfirmed() {
      if (this.personToRemove) {
        this.removeStandbyMember(this.personToRemove);
      } else {
        throw new Error(
          "Konnte Person nicht entfernen wegen einem internen Fehler (personToRemove darf nicht NULL sein)."
        );
      }
    },

    back() {
      this.$emit("back");
    },
  },
};
</script>

<style scoped>
.list-enter-active {
  transition: all 1.2s;
}
.list-leave-active {
  transition: all 0.6s;
}

.list-enter {
  background: green !important;
}
.list-leave-to {
  background: red !important;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
