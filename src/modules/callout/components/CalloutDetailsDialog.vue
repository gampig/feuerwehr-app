<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    @update:model-value="$emit('update:model-value', false)"
  >
    <v-card>
      <v-card-title>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('update:model-value', false)"
        >
        </v-btn>
        Details zum Einsatz
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
