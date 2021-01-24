<template>
  <v-card class="ma-1" :loading="loadingCallout">
    <v-card-title> Einsatz bearbeiten </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <CalloutForm ref="form" v-bind.sync="item" require-keyword />
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn color="primary" text @click="$emit('back')"> Zurück </v-btn>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" color="primary" @click="submit">
        Speichern & Weiter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CalloutForm from "../form/Form";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    CalloutForm,
  },

  data() {
    return {
      loading: false,
      item: {},
      emptyItem: {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        address: null,
      },
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout", loadingCallout: "loading" }),
  },

  watch: {
    callout(callout) {
      this.item = Object.assign({}, this.emptyItem, callout);
    },
  },

  mounted() {
    this.item = Object.assign({}, this.emptyItem, this.callout);
  },

  methods: {
    ...mapActions("callouts", ["create"]),
    ...mapActions("callout", ["bind", "updateCallout"]),

    submit() {
      if (this.$refs.form.$refs.form.validate()) {
        const submittedData = this.item;

        this.loading = true;
        if (this.callout) {
          this.updateCallout(submittedData)
            .then(() => this.$emit("input"))
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.create(submittedData)
            .then((ref) => this.bind(ref.key))
            .then(() => {
              this.$emit("input");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }
    },
  },
};
</script>
