<template>
  <v-card class="ma-1" :loading="calloutLoading || vehicleLoading">
    <v-card-title> Einsatzende {{ vehicle && vehicle.name }} </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <vehicle-details-form
        ref="form"
        :alarm-time="callout && callout.alarmTime"
        v-bind.sync="item"
    /></v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="$emit('back')" color="primary" text> Zurück </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="submit" :loading="loading" color="primary">
        Speichern & Weiter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VehicleDetailsForm from "../form/VehicleDetailsForm";

export default {
  components: { VehicleDetailsForm },

  data() {
    return {
      item: {},
      emptyItem: {
        endTime: null,
      },
      loading: false,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout", calloutLoading: "loading" }),
    ...mapState("vehicles", { vehicle: "vehicle", vehicleLoading: "loading" }),
  },

  watch: {
    callout(callout) {
      this.importItem(callout, this.vehicle);
    },
    vehicle(vehicle) {
      this.importItem(this.callout, vehicle);
    },
  },

  mounted() {
    this.importItem(this.callout, this.vehicle);
  },

  methods: {
    ...mapActions("callout", ["updateVehicleDetails"]),

    importItem(callout, vehicle) {
      this.item = Object.assign(
        {},
        this.emptyItem,
        callout &&
          callout.vehicles &&
          vehicle &&
          vehicle.id &&
          callout.vehicles[vehicle.id]
      );
    },

    submit() {
      if (this.$refs.form.$refs.form.validate()) {
        this.loading = true;
        this.updateVehicleDetails({
          vehicleId: this.vehicle.id,
          details: this.item,
        })
          .then(() => this.$emit("input"))
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
