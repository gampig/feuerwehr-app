<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    @update:model-value="$emit('update:model-value', false)"
  >
    <v-card>
      <v-card-title class="text-h5">
        Details zum Einsatz
        <v-spacer></v-spacer>
        <v-btn size="large" icon @click="$emit('update:model-value', false)">
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
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
