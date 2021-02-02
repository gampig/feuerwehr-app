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

  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
