<template>
  <v-dialog
    :model-value="value"
    max-width="700"
    @update:model-value="$emit('input', false)"
  >
    <v-card>
      <v-card-title class="text-h5">
        Details zum Einsatz
        <v-spacer></v-spacer>
        <v-btn size="large" icon @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <CalloutDetails />
    </v-card>
  </v-dialog>
</template>

<script>
import CalloutDetails from "./CalloutDetails.vue";

export default {
  components: { CalloutDetails },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
