<template>
  <v-card v-bind="$attrs">
    <v-form ref="form" @submit.prevent="submit">
      <v-card-title>{{ cardTitle }}</v-card-title>

      <v-card-text>
        <v-text-field
          v-if="!noEmail"
          v-model="item.email"
          label="E-Mail"
          :rules="emailRules"
        />
        <v-text-field
          v-model="item.password"
          type="password"
          label="Passwort"
          :rules="passwordRules"
        />
        <v-checkbox
          v-if="askForPersistence"
          v-model="item.persist"
          label="Angemeldet bleiben"
        ></v-checkbox>
      </v-card-text>

      <v-card-actions>
        <slot />
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    values: {
      type: Object,
    },

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
  },
  data() {
    return {
      emailRules: [(v) => !!v || "Bitte E-Mail-Adresse eingeben"],
      passwordRules: [(v) => !!v || "Bitte Passwort eingeben"],
    };
  },
  computed: {
    item() {
      return (
        this.values || {
          email: "",
          password: "",
          persist: false,
        }
      );
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("input", this.item);
      }
    },
  },
};
</script>
