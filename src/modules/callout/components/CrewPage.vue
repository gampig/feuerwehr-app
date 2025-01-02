<template>
  <div>
    <AppBar back-button :page-title="pageTitle">
      <slot name="actions" />

      <v-menu location="bottom left">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="callout" @click="showCalloutDetails = true">
            <v-list-item-title>Einsatz anzeigen</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-if="saveButton"
        class="ml-3"
        :loading="loading"
        color="primary"
        variant="flat"
        @click="$emit('submit')"
      >
        {{ saveButtonLabel }}
      </v-btn>
    </AppBar>

    <v-container>
      <slot />
    </v-container>

    <CalloutDetailsDialog v-if="callout" v-model="showCalloutDetails" />
  </div>
</template>

<script>
import AppBar from "@/components/bars/AppBar.vue";
import CalloutDetailsDialog from "./CalloutDetailsDialog.vue";
import { mapState } from "pinia";
import { useCalloutStore } from "../stores/callout";

export default {
  components: { AppBar, CalloutDetailsDialog },
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

  emits: ["submit"],

  data() {
    return {
      showCalloutDetails: false,
    };
  },

  computed: {
    ...mapState(useCalloutStore, ["callout"]),
  },
};
</script>
