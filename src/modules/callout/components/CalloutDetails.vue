<template>
  <v-list v-if="callout">
    <ListItem icon="mdi-alarm-light" subtitle="Alarm">
      {{ callout.alarmTime | formatDateTime }}
      ({{ callout.alarmTime | formatDateTimeFromNow }})
    </ListItem>

    <ListItem v-if="callout.endTime" icon="mdi-calendar-check" subtitle="Ende">
      {{ callout.endTime | formatDateTime }}
      (Dauer {{ duration(callout.endTime) }})
    </ListItem>

    <ListItem v-if="callout.type" icon="mdi-clipboard-list" subtitle="Typ">
      <v-chip
        v-for="(val, type) in callout.type"
        :key="type"
        class="mr-1"
        small
        outlined
        >{{ type }}</v-chip
      >
    </ListItem>

    <ListItem
      v-if="callout.keyword"
      icon="mdi-clipboard-text"
      subtitle="Stichwort"
    >
      {{ callout.keyword }}
    </ListItem>

    <ListItem
      v-if="callout.catchphrase"
      icon="mdi-clipboard-text"
      subtitle="Schlagwort"
    >
      {{ callout.catchphrase }}
    </ListItem>

    <ListItem v-if="callout.address" icon="mdi-home" subtitle="Adresse">
      {{ callout.address }}
    </ListItem>

    <v-divider v-if="standbyCrew || vehicles"></v-divider>

    <v-list-group v-if="standbyCrew">
      <template #activator>
        <v-list-item-avatar>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-avatar>
        <v-list-item-title> Bereitschaft </v-list-item-title>
      </template>

      <v-list-item
        v-for="(value, person) in standbyCrew"
        :key="'standby' + person"
      >
        <v-list-item-avatar></v-list-item-avatar>
        <v-list-item-title>
          {{ person }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group v-if="vehicles" :value="true">
      <template #activator>
        <v-list-item-avatar>
          <v-icon>mdi-truck</v-icon>
        </v-list-item-avatar>
        <v-list-item-title> Fahrzeuge </v-list-item-title>
      </template>

      <v-list-group
        v-for="calloutVehicle in vehicles"
        :key="calloutVehicle.vehicle.id"
        sub-group
      >
        <template #prependIcon>
          <v-avatar v-if="calloutVehicle.vehicle.pictureUrl">
            <v-img
              :src="calloutVehicle.vehicle.pictureUrl"
              :alt="calloutVehicle.vehicle.name"
            >
              <template #placeholder>
                <v-icon>mdi-truck-outlined</v-icon>
              </template>
            </v-img>
          </v-avatar>
          <v-icon v-else>mdi-truck-outlined</v-icon>
        </template>
        <template #activator>
          <v-list-item-content>
            <v-list-item-title>{{
              calloutVehicle.vehicle.name
            }}</v-list-item-title>
            <v-list-item-subtitle>
              Besatzung:
              {{
                (calloutVehicle.crewMembers &&
                  Object.keys(calloutVehicle.crewMembers).length) ||
                "0"
              }}
              <template v-if="calloutVehicle.vehicle.maxCrewNumber">
                / {{ calloutVehicle.vehicle.maxCrewNumber }}
              </template>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="
                calloutVehicle.calloutDetails &&
                calloutVehicle.calloutDetails.endTime
              "
            >
              Einsatzende:
              {{ calloutVehicle.calloutDetails.endTime | formatDateTime }}
              (Dauer: {{ duration(calloutVehicle.calloutDetails.endTime) }})
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(role, person) in calloutVehicle.crewMembers"
          :key="calloutVehicle.vehicle.id + person"
        >
          <v-list-item-avatar></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ person }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="role != true">
              {{ role }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list-group>
  </v-list>
</template>

<script>
import moment from "moment";
import ListItem from "@/components/ListItem";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    ListItem,
  },

  computed: {
    ...mapState("callout", ["callout", "crew"]),
    ...mapGetters("vehicles", { findVehicle: "find" }),

    standbyCrew() {
      return (this.crew && this.crew.standby) || null;
    },

    vehicles() {
      if (!this.callout) return null;

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

      return Object.keys(vehicles).length > 0 ? vehicles : null;
    },
  },

  methods: {
    duration(endTime) {
      if (!this.callout || !this.callout.alarmTime || !endTime) {
        return "";
      }

      const alarm = moment.unix(this.callout.alarmTime);
      const end = moment.unix(endTime);
      return moment.duration(alarm.diff(end)).humanize();
    },
  },
};
</script>
