<template>
  <v-list>
    <list-item icon="mdi-alarm-light" subtitle="Alarm">
      {{ item["alarmTime"] | formatDateTime }}
      ({{ item.alarmTime | formatDateTimeFromNow }})
    </list-item>

    <list-item v-if="item.endTime" icon="mdi-calendar-check" subtitle="Ende">
      {{ item["endTime"] | formatDateTime }}
      (Dauer {{ duration(item.endTime) }})
    </list-item>

    <list-item v-if="item.type" icon="mdi-clipboard-list" subtitle="Typ">
      <v-chip
        v-for="(val, type) in item.type"
        :key="type"
        class="mr-1"
        small
        outlined
        >{{ type }}</v-chip
      >
    </list-item>

    <list-item
      v-if="item.keyword"
      icon="mdi-clipboard-text"
      subtitle="Stichwort"
    >
      {{ item["keyword"] }}
    </list-item>

    <list-item
      v-if="item.catchphrase"
      icon="mdi-clipboard-text"
      subtitle="Schlagwort"
    >
      {{ item["catchphrase"] }}
    </list-item>

    <list-item v-if="item.address" icon="mdi-home" subtitle="Adresse">
      {{ item["address"] }}
    </list-item>

    <v-divider v-if="item.standbyCrew || item.vehicles"></v-divider>

    <v-list-group v-if="item.standbyCrew">
      <template #activator>
        <v-list-item-avatar>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-avatar>
        <v-list-item-title> Bereitschaft </v-list-item-title>
      </template>

      <v-list-item
        v-for="(value, person) in item.standbyCrew"
        :key="'standby' + person"
      >
        <v-list-item-avatar></v-list-item-avatar>
        <v-list-item-title>
          {{ person }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group v-if="item.vehicles" :value="true">
      <template #activator>
        <v-list-item-avatar>
          <v-icon>mdi-truck</v-icon>
        </v-list-item-avatar>
        <v-list-item-title> Fahrzeuge </v-list-item-title>
      </template>

      <v-list-group
        v-for="calloutVehicle in item.vehicles"
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
                (item.crewMembers &&
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

export default {
  components: {
    ListItem,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    duration(endTime) {
      if (!this.item.alarmTime || !endTime) {
        return "";
      }

      const alarm = moment.unix(this.item.alarmTime);
      const end = moment.unix(endTime);
      return moment.duration(alarm.diff(end)).humanize();
    },
  },
};
</script>
