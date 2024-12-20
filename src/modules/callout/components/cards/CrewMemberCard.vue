<template>
  <v-card v-bind="$attrs">
    <v-toolbar color="secondary" dark flat>
      <v-toolbar-title>
        {{ person }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('delete')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-select
        :model-value="role"
        :items="roles"
        label="Funktion"
        :loading="loading"
        :disabled="loading"
        clearable
        @update:model-value="update"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ALL_CALLOUT_ROLES, CalloutRole } from "../../models/Callout";

export default defineComponent({
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
