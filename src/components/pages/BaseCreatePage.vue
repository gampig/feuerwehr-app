<template>
  <BasePage v-bind="$attrs" back-button>
    <template #actions>
      <v-toolbar-items>
        <v-btn :loading="creating" text @click="$emit('submit')">
          Erstellen
        </v-btn>
      </v-toolbar-items>
    </template>

    <v-container>
      <v-card>
        <v-card-text>
          <slot></slot>
        </v-card-text>
      </v-card>
    </v-container>
  </BasePage>
</template>

<script>
export default {
  props: {
    creating: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
