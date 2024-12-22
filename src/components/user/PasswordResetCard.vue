<template>
  <v-card v-bind="$attrs">
    <v-form ref="form" @submit.prevent="submit">
      <v-card-title>Neues Passwort setzen</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="item.newPassword"
          type="password"
          label="Neues Passwort"
          :rules="passwordRules"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" :loading="loading" color="primary">
          Passwort speichern
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      passwordRules: [(v) => !!v || "Bitte Passwort eingeben"],
    };
  },

  computed: {
    item() {
      return { newPassword: "" };
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("update:model-value", this.item.newPassword);
      }
    },
  },
};
</script>
