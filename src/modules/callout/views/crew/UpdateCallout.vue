<template>
  <CrewPage
    page-title="Einsatz bearbeiten"
    :loading="loading"
    save-button
    @submit="submit"
  >
    <v-card :loading="loadingCallout">
      <v-card-text>
        <CalloutForm ref="form" v-bind.sync="item" require-keyword />
      </v-card-text>
    </v-card>
  </CrewPage>
</template>

<script>
import CrewPage from "../../components/CrewPage";
import CalloutForm from "../../components/form/Form";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    CrewPage,
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
            .then(() => this.next(this.callout.id))
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.create(submittedData)
            .then((ref) => this.next(ref.key))
            .finally(() => {
              this.loading = false;
            });
        }
      }
    },

    next(calloutId) {
      this.$router.push({
        name: "CrewEditCallout",
        params: { callout_id: calloutId },
      });
    },
  },
};
</script>
