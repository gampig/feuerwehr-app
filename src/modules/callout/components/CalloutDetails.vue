<template>
  <v-list>
    <list-item icon="mdi-alarm-light" subtitle="Alarm">
      {{ item["alarmTime"] | formatDateTime }}
      ({{ item.alarmTime | formatDateTimeFromNow }})
    </list-item>

    <list-item icon="mdi-calendar-check" subtitle="Ende" v-if="item.endTime">
      {{ item["endTime"] | formatDateTime }}
      (Dauer {{ duration(item.endTime) }})
    </list-item>

    <list-item icon="mdi-clipboard-list" subtitle="Typ" v-if="item.type">
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
      icon="mdi-clipboard-text"
      subtitle="Stichwort"
      v-if="item.keyword"
    >
      {{ item["keyword"] }}
    </list-item>

    <list-item
      icon="mdi-clipboard-text"
      subtitle="Schlagwort"
      v-if="item.catchphrase"
    >
      {{ item["catchphrase"] }}
    </list-item>

    <list-item icon="mdi-home" subtitle="Adresse" v-if="item.address">
      {{ item["address"] }}
    </list-item>

    <v-divider v-if="item.standbyCrew || item.vehicles"></v-divider>

    <v-list-group v-if="item.standbyCrew">
      <template v-slot:activator>
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
      <template v-slot:activator>
        <v-list-item-avatar>
          <v-icon>mdi-truck</v-icon>
        </v-list-item-avatar>
        <v-list-item-title> Fahrzeuge </v-list-item-title>
      </template>

      <v-list-group
        v-for="item in item.vehicles"
        :key="item.vehicle.id"
        sub-group
      >
        <template v-slot:prependIcon>
          <v-avatar v-if="item.vehicle.pictureUrl">
            <v-img :src="item.vehicle.pictureUrl" :alt="item.vehicle.name">
              <template v-slot:placeholder>
                <v-icon>mdi-truck-outlined</v-icon>
              </template>
            </v-img>
          </v-avatar>
          <v-icon v-else>mdi-truck-outlined</v-icon>
        </template>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ item.vehicle.name }}</v-list-item-title>
            <v-list-item-subtitle>
              Besatzung:
              {{
                (item.crewMembers && Object.keys(item.crewMembers).length) ||
                "0"
              }}
              <template v-if="item.vehicle.maxCrewNumber">
                / {{ item.vehicle.maxCrewNumber }}
              </template>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.calloutDetails && item.calloutDetails.endTime"
            >
              Einsatzende:
              {{ item.calloutDetails.endTime | formatDateTime }} (Dauer:
              {{ duration(item.calloutDetails.endTime) }})
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(role, person) in item.crewMembers"
          :key="item.vehicle.id + person"
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
