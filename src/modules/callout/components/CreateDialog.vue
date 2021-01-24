<template>
  <v-dialog :value="value" persistent max-width="900" @input="cancel">
    <v-card>
      <v-card-title> Neuer Einsatz </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <callout-form ref="form" v-bind.sync="item"></callout-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="loading" color="primary" text @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import CalloutForm from "./form/Form";

export default {
  components: { CalloutForm },

  props: {
    value: {
      type: Boolean,
    },
  },

  data() {
    return {
      item: {},
      loading: false,
    };
  },

  methods: {
    ...mapActions("callouts", ["create"]),
    ...mapActions("callout", ["bind"]),

    reset() {
      this.item = {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        endTime: null,
        address: null,
      };
      this.loading = false;
    },
    cancel() {
      this.$emit("input", false);
      this.reset();
    },
    save() {
      if (this.$refs.form.$refs.form.validate()) {
        this.loading = true;
        this.create(this.item).then((ref) => {
          this.bind(ref.key);
          this.$emit("input", false);
          this.$emit("save", ref.key);
          this.reset();
        });
      }
    },
  },

  created() {
    this.reset();
  },
};
</script>
