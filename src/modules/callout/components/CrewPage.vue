<template>
  <div>
    <v-app-bar>
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

      <v-spacer />

      <slot name="actions" />

      <v-menu location="bottom left">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-if="$store.state.callout.callout"
            @click="showCalloutDetails = true"
          >
            <v-list-item-title>Einsatz anzeigen</v-list-item-title>
          </v-list-item>
          <v-list-item @click="reload">
            <v-list-item-title>Daten neu laden</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-if="saveButton"
        class="ml-3"
        :loading="loading"
        color="primary"
        @click="$emit('submit')"
      >
        {{ saveButtonLabel }}
      </v-btn>
    </v-app-bar>

    <v-container>
      <slot />
    </v-container>

    <CalloutDetailsDialog
      v-if="$store.state.callout.callout"
      v-model="showCalloutDetails"
    />
  </div>
</template>

<script>
import modules from "@/modules";
import CalloutDetailsDialog from "./CalloutDetailsDialog.vue";

export default {
  components: { CalloutDetailsDialog },
  props: {
    pageTitle: {
      type: String,
      default: "Einsatz",
    },

    saveButton: {
      type: Boolean,
      default: false,
    },

    saveButtonLabel: {
      type: String,
      default: "Weiter",
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showCalloutDetails: false,
    };
  },

  methods: {
    reload: () => modules.onLogin(),
    goBack() {
      this.$router.back();
    },
  },
};
</script>
