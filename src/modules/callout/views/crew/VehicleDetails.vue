<template>
  <CrewPage :page-title="title" :loading="saving" save-button @submit="submit">
    <v-card :loading="loading">
      <v-card-title>
        <template v-if="vehicle">
          <v-avatar class="mr-3">
            <v-img
              v-if="vehicle && vehicle.pictureUrl"
              :src="vehicle.pictureUrl"
            />
            <v-icon v-else>mdi-fire-truck</v-icon>
          </v-avatar>
          {{ vehicle.name }}
        </template>
        Einsatzende
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <VehicleDetailsForm
          ref="form"
          :alarm-time="callout && callout.alarmTime"
          v-bind.sync="item"
      /></v-card-text>
    </v-card>
  </CrewPage>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CrewPage from "../../components/CrewPage";
import VehicleDetailsForm from "../../components/form/VehicleDetailsForm";

export default {
  components: { CrewPage, VehicleDetailsForm },

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
        endTime: null,
      },
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout" }),
    ...mapState("vehicles", { vehicle: "vehicle" }),

    title() {
      return (this.vehicle && this.vehicle.name) || "Fahrzeug";
    },
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
    ...mapActions("callout", ["updateVehicleDetails"]),

    setItem() {
      this.item = Object.assign(
        {},
        this.emptyItem,
        this.callout &&
          this.callout.vehicles &&
          this.vehicle &&
          this.vehicle.id &&
          this.callout.vehicles[this.vehicle.id]
      );
    },

    submit() {
      if (this.$refs.form.$refs.form.validate()) {
        this.saving = true;
        this.updateVehicleDetails({
          vehicleId: this.vehicle.id,
          details: this.item,
        })
          .then(() =>
            this.$router.push({
              name: "CrewPeople",
              params: {
                callout_id: this.callout.id,
                vehicle_id: this.vehicle.id,
              },
            })
          )
          .finally(() => {
            this.saving = false;
          });
      }
    },
  },
};
</script>
