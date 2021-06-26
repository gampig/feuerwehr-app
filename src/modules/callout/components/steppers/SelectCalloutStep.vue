<template>
  <CalloutList class="ma-1" @input="selectCallout">
    <v-card-title>
      Einsatz auswählen
      <v-spacer />
      <v-btn icon @click="reload"><v-icon>mdi-reload</v-icon></v-btn>
    </v-card-title>

    <v-divider></v-divider>
  </CalloutList>
</template>

<script>
import modules from "@/modules";
import CalloutList from "../CalloutList";

export default {
  components: { CalloutList },

  methods: {
    selectCallout(calloutId) {
      this.$emit("input", calloutId);
    },

    reload: () => modules.onLogin(),
  },
};
</script>
