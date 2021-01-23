<template>
  <v-dialog @input="$emit('input', false)" :value="value" max-width="700">
    <v-card>
      <v-card-title class="headline">
        Details zum Einsatz
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" large icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <callout-details v-if="item" :item="item" />
    </v-card>
  </v-dialog>
</template>

<script>
import CalloutDetails from "./CalloutDetails";

export default {
  components: { CalloutDetails },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
    },
  },
};
</script>
