<template>
  <BasePage page-title="Einsatz" back-button>
    <template #actions>
      <v-btn v-if="isAdmin" :to="editRoute" icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-container>
      <BaseToolbar :handle-delete="isAdmin ? del : null">
        <template slot="left">
          <v-toolbar-title v-if="item">
            {{ item.keyword }} -
            {{ item.alarmTime | formatDateTime }}
          </v-toolbar-title>
        </template>
      </BaseToolbar>

      <v-card>
        <CalloutDetails v-if="item" :item="item" />
      </v-card>
    </v-container>

    <Loading :visible="loading" />
  </BasePage>
</template>

<script>
import Loading from "@/components/Loading";
import makeShowMixin from "@/mixins/ShowMixin";
import CalloutDetails from "../components/CalloutDetails";
import { mapActions, mapGetters, mapState } from "vuex";

export default makeShowMixin("Callout", "callouts").extend({
  components: {
    Loading,
    CalloutDetails,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState("callout", ["callout", "crew"]),
    ...mapGetters("vehicles", { findVehicle: "find" }),
    ...mapGetters("auth", ["isAdmin"]),

    editRoute() {
      return { name: "CalloutUpdate", params: { id: this.id } };
    },
    item() {
      if (!this.callout) {
        return null;
      }

      let vehicles = {};

      if (this.crew && this.crew.vehicles) {
        for (const vehicleIdx in this.crew.vehicles) {
          vehicles[vehicleIdx] = {
            vehicle: this.findVehicle(vehicleIdx),
            crewMembers: this.crew.vehicles[vehicleIdx],
          };
        }
      }

      if (this.callout.vehicles) {
        for (const vehicleIdx in this.callout.vehicles) {
          if (!vehicles[vehicleIdx]) {
            vehicles[vehicleIdx] = {
              vehicle: this.findVehicle(vehicleIdx),
            };
          }

          vehicles[vehicleIdx].calloutDetails = this.callout.vehicles[
            vehicleIdx
          ];
        }
      }

      return {
        ...this.callout,
        standbyCrew: (this.crew && this.crew.standby) || null,
        vehicles: vehicles !== {} ? vehicles : null,
      };
    },
  },

  methods: {
    ...mapActions("callout", ["bind", "remove"]),

    retrieveItem() {
      this.loading = true;

      return this.bind(this.id).finally(() => {
        this.loading = false;
      });
    },
    del() {
      this.remove().then(() => {
        this.showMessage("Objekt wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
