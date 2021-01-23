<template>
  <v-card v-bind="$attrs">
    <v-form ref="form" @submit.prevent="submit">
      <v-card-title>{{ cardTitle }}</v-card-title>

      <v-card-text>
        <v-text-field
          v-if="!noEmail"
          label="E-Mail"
          v-model="item.email"
          :rules="emailRules"
        />
        <v-text-field
          type="password"
          label="Passwort"
          v-model="item.password"
          :rules="passwordRules"
        />
        <v-checkbox
          v-if="askForPersistence"
          label="Angemeldet bleiben"
          v-model="item.persist"
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
