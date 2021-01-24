<template>
  <v-card v-bind="$attrs">
    <v-form ref="form" @submit.prevent="submit">
      <v-card-title>Passwort zurücksetzen</v-card-title>

      <v-card-text>
        <v-text-field v-model="item.email" label="E-Mail" :rules="emailRules" />
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
  },
  data() {
    return {
      emailRules: [(v) => !!v || "Bitte E-Mail-Adresse eingeben"],
    };
  },
  computed: {
    item() {
      return { email: this.values || "" };
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("input", this.item.email);
      }
    },
  },
};
</script>
