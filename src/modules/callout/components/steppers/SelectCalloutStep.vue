<template>
  <CalloutList class="ma-1" @update:model-value="selectCallout">
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
import CalloutList from "../CalloutList.vue";

export default {
  components: { CalloutList },

  methods: {
    selectCallout(calloutId) {
      this.$emit("update:model-value", calloutId);
    },

    reload: () => modules.onLogin(),
  },
};
</script>
