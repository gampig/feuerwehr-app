<template>
  <v-card v-bind="$attrs">
    <v-form ref="form" @submit.stop="submit">
      <v-card-title>{{ cardTitle }}</v-card-title>

      <v-card-text>
        <v-text-field
          v-if="!noEmail"
          v-model="email"
          label="E-Mail"
          :rules="emailRules"
        />
        <v-text-field
          v-model="password"
          type="password"
          label="Passwort"
          :rules="passwordRules"
        />
        <v-checkbox
          v-if="askForPersistence"
          v-model="persist"
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
      email: "",
      password: "",
      persist: false,
    };
  },

  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit("submit", {
          email: this.email,
          password: this.password,
          persist: this.persist,
        });
      }
    },
  },
};
</script>
