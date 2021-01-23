<template>
  <page v-bind="$attrs" back-button>
    <template v-slot:actions>
      <v-toolbar-items>
        <v-btn @click="$emit('submit')" :loading="creating" text>
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
  </page>
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
