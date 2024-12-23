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
          {{ vehicle.name }}:
        </template>
        Details
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form">
          <v-checkbox
            v-if="vehicle?.isUgOeel"
            v-model="isUgOeelCallout"
            label="UG-ÖEL-Einsatz"
            :indeterminate="
              isUgOeelCallout === null || isUgOeelCallout === undefined
            "
            :rules="[calloutRules.ugOeelCalloutRequired]"
          />

          <v-text-field
            label="Einsatzende"
            append-inner-icon="mdi-calendar-check-outline"
            :model-value="endTimeFormatted"
            :rules="[rules.restrictFuture, calloutRules.endAfterAlarm]"
            readonly
            clearable
            @click="showEndTimeDialog = true"
            @click:clear="updateEndTime(null)"
          />

          <BaseDateTimeDialog
            v-model="showEndTimeDialog"
            :max-date="tomorrow"
            :min-date="alarmDate"
            :date="item.endTime"
            @update:date="updateEndTime($event)"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </CrewPage>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CrewPage from "../../components/CrewPage.vue";
import { dateTimeToUnix, formatDateTime, tomorrow } from "@/utils/dates";
import moment from "moment";
import { defineComponent } from "vue";
import { restrictFuture } from "@/utils/rules";

export default defineComponent({
  components: { CrewPage },

  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      rules: {
        restrictFuture,
      },

      calloutRules: {
        endAfterAlarm: (value) =>
          !value ||
          !this.callout?.alarmTime ||
          dateTimeToUnix(value) >= this.callout.alarmTime ||
          "Ende kann nicht vor Alarm sein",

        ugOeelCalloutRequired: (value) =>
          (value !== null && value !== undefined) ||
          "Bitte fülle dieses Feld aus",
      },

      showEndTimeDialog: false,
      saving: false,
      item: {},
      emptyItem: {
        endTime: null,
      },

      isUgOeelCallout: null,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout" }),
    ...mapState("vehicles", { vehicle: "vehicle" }),

    tomorrow: () => tomorrow.value,

    title() {
      return (this.vehicle && this.vehicle.name) || "Fahrzeug";
    },

    alarmDate() {
      return this.callout?.alarmTime
        ? moment.unix(this.callout.alarmTime).format("YYYY-MM-DD")
        : "";
    },

    endTimeFormatted() {
      return this.item.endTime ? formatDateTime(this.item.endTime) : "";
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
    ...mapActions("callout", ["updateCallout", "updateVehicleDetails"]),

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

      this.isUgOeelCallout = this.callout?.type && this.callout.type["UG-ÖEL"];
    },

    updateEndTime(endTime) {
      this.item.endTime = endTime;
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.saving = true;

        Promise.all([
          this.isUgOeelCallout !== undefined && this.isUgOeelCallout !== null
            ? this.updateCallout({
                type: {
                  ...this.callout.type,
                  "UG-ÖEL": this.isUgOeelCallout,
                },
              })
            : Promise.resolve(null),

          this.updateVehicleDetails({
            vehicleId: this.vehicle.id,
            details: this.item,
          }),
        ])
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
});
</script>
