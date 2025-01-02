<template>
  <v-card v-bind="$attrs">
    <v-card-title>{{ cardTitle }}</v-card-title>

    <v-card-text>
      <v-text-field
        v-if="!noEmail"
        label="E-Mail"
        :rules="emailRules"
        :model-value="email"
        @update:model-value="$emit('update:email', $event)"
      />
      <v-text-field
        type="password"
        label="Passwort"
        :rules="passwordRules"
        :model-value="password"
        @update:model-value="$emit('update:password', $event)"
      />
      <v-checkbox
        v-if="askForPersistence"
        label="Angemeldet bleiben"
        :model-value="persist"
        @update:model-value="$emit('update:persist', $event)"
      ></v-checkbox>
    </v-card-text>

    <v-card-actions>
      <slot />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    cardTitle: {
      type: String,
      default: "Anmelden",
    },

    noEmail: {
      type: Boolean,
      default: false,
    },

    askForPersistence: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "",
    },

    persist: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:email", "update:password", "update:persist"],

  data() {
    return {
      emailRules: [(v?: string) => !!v || "Bitte E-Mail-Adresse eingeben"],
      passwordRules: [(v?: string) => !!v || "Bitte Passwort eingeben"],
    };
  },
};
</script>
