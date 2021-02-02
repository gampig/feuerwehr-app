<template>
  <CrewPage
    page-title="Einsatz bearbeiten"
    :loading="saving"
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
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";
import CalloutForm from "../../components/form/Form";
import { mapActions } from "vuex";

export default {
  components: {
    CrewPage,
    CalloutForm,
  },

  mixins: [CalloutGroupMixin],

  data() {
    return {
      saving: false,
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

  watch: {
    loadingCallout(loading) {
      if (!loading) {
        this.item = Object.assign({}, this.emptyItem, this.callout);
      }
    },
  },

  methods: {
    ...mapActions("callouts", ["create"]),
    ...mapActions("callout", ["updateCallout"]),

    submit() {
      if (this.$refs.form.$refs.form.validate()) {
        const submittedData = this.item;

        this.saving = true;
        if (this.callout) {
          this.updateCallout(submittedData)
            .then(() => this.next(this.callout.id))
            .finally(() => {
              this.saving = false;
            });
        } else {
          this.create(submittedData)
            .then((ref) => this.next(ref.key))
            .finally(() => {
              this.saving = false;
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
