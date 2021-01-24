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
      <person-autocomplete
        :items="peopleWithoutCrew"
        :loading="loading"
        @input="onAdd"
      ></person-autocomplete>

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
    </v-card-actions>
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
      const personId = item;

      this.removeStandbyMember(personId);
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
