<template>
  <v-card v-bind="$attrs" v-on="$listeners">
    <v-toolbar color="secondary" dark flat>
      <v-toolbar-title>
        {{ person }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('delete')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-select
        :value="role"
        :items="roles"
        label="Funktion"
        :loading="loading"
        :disabled="loading"
        clearable
        @input="update"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Vue, { PropType } from "vue";
import { ALL_CALLOUT_ROLES, CalloutRole } from "../../models/Callout";
/* eslint-enable */

export default Vue.extend({
  props: {
    person: {
      type: String,
      required: true,
    },

    role: {
      type: String as PropType<CalloutRole>,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      roles: ALL_CALLOUT_ROLES,
    };
  },

  methods: {
    update(role: CalloutRole): void {
      this.$emit("input", role);
    },
  },
});
</script>
