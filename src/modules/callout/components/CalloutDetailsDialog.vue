<template>
  <v-dialog :value="value" max-width="700" @input="$emit('input', false)">
    <v-card>
      <v-card-title class="headline">
        Details zum Einsatz
        <v-spacer></v-spacer>
        <v-btn large icon @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <CalloutDetails />
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
  },
};
</script>
