<template>
  <BasePage v-bind="$attrs" back-button>
    <template #actions>
      <slot name="actions" />
      <v-btn icon @click="reload"><v-icon>mdi-reload</v-icon></v-btn>
      <v-btn
        v-if="saveButton"
        class="ml-3"
        :loading="loading"
        color="primary"
        @click="$emit('submit')"
      >
        Speichern & Weiter
      </v-btn>
    </template>

    <v-container>
      <slot />
    </v-container>
  </BasePage>
</template>

<script>
import modules from "@/modules";

export default {
  props: {
    saveButton: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    const paramCalloutId = this.$route.params.callout_id;
    const paramVehicleId = this.$route.params.vehicle_id;

    if (paramCalloutId) {
      const callout = this.$store.state.callout.callout;
      if (!(callout && callout.id == paramCalloutId)) {
        this.$store.dispatch("callout/bind", paramCalloutId);
      }
    }

    if (paramVehicleId) {
      const vehicle = this.$store.state.callout.vehicle;
      if (!(vehicle && vehicle.id == paramVehicleId)) {
        this.$store.dispatch("callout/bindVehicle", paramVehicleId);
      }
    }
  },

  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
