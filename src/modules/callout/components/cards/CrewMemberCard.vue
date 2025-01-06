<template>
  <v-card v-bind="$attrs" variant="outlined">
    <v-card-title>
      {{ person }}
    </v-card-title>
    <v-card-text>
      <v-select
        :model-value="role"
        :items="roles"
        label="Funktion"
        :loading="loading"
        :disabled="loading"
        variant="underlined"
        clearable
        class="hide-input-details"
        @update:model-value="update"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn icon="mdi-delete" @click="$emit('delete')"></v-btn>
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
      default: undefined,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["delete", "update:model-value"],

  data() {
    return {
      roles: ALL_CALLOUT_ROLES,
    };
  },

  methods: {
    update(role?: CalloutRole): void {
      this.$emit("update:model-value", role);
    },
  },
});
</script>

<style scoped>
.hide-input-details :deep(.v-input__details) {
  display: none;
}
</style>
