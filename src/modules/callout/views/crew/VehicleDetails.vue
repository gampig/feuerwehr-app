<template>
  <CrewPage :page-title="title" :loading="saving" save-button @submit="submit">
    <v-card :loading="loadingCallout || loadingVehicle">
      <v-card-title>
        <template v-if="vehicle">
          <v-avatar class="mr-3">
            <v-img :src="vehicle.pictureUrl" />
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
import { mapActions } from "vuex";
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";
import VehicleDetailsForm from "../../components/form/VehicleDetailsForm";

export default {
  components: { CrewPage, VehicleDetailsForm },
  mixins: [CalloutGroupMixin],

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
    title() {
      return (this.vehicle && this.vehicle.name) || "Fahrzeug";
    },
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.item = Object.assign(
          {},
          this.emptyItem,
          this.callout &&
            this.callout.vehicles &&
            this.vehicle &&
            this.vehicle.id &&
            this.callout.vehicles[this.vehicle.id]
        );
      }
    },
  },

  methods: {
    ...mapActions("callout", ["updateVehicleDetails"]),

    submit() {
      if (this.$refs.form.$refs.form.validate()) {
        this.saving = true;
        this.updateVehicleDetails({
          vehicleId: this.vehicle.id,
          details: this.item,
        })
          .then(() => this.next(this.callout.id, this.vehicle.id))
          .finally(() => {
            this.saving = false;
          });
      }
    },
  },
};
</script>
