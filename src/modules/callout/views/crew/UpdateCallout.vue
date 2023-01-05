<template>
  <CrewPage
    page-title="Einsatz bearbeiten"
    :loading="saving"
    save-button
    @submit="submit"
  >
    <v-card :loading="loading">
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

  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },

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

  computed: {
    ...mapState("callout", ["callout"]),
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.setItem();
      }
    },
  },

  created() {
    this.setItem();
  },

  methods: {
    ...mapActions("callouts", ["create"]),
    ...mapActions("callout", ["updateCallout"]),

    setItem() {
      this.item = Object.assign({}, this.emptyItem, this.callout);
    },

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
            .then((ref) => {
              this.updateRoute(ref.key);
              this.next(ref.key);
            })
            .finally(() => {
              this.saving = false;
            });
        }
      }
    },

    updateRoute(calloutId) {
      this.$router.replace({
        name: this.$route.name,
        params: { callout_id: calloutId },
      });
    },

    next(calloutId) {
      const vehicle = this.$store.state.vehicles.vehicle;
      if (vehicle && vehicle.id) {
        this.$router.push({
          name: "CrewVehicleDetails",
          params: {
            callout_id: calloutId,
            vehicle_id: vehicle.id,
          },
        });
      } else {
        this.$router.push({
          name: "CrewVehicles",
          params: {
            callout_id: calloutId,
          },
        });
      }
    },
  },
};
</script>
