<template>
  <v-card v-bind="$attrs" v-on="$listeners" append>
    <v-img
      v-if="value.pictureUrl"
      :src="value.pictureUrl"
      :alt="value.name"
      height="100px"
    />

    <v-card-title>
      {{ value.name }}
    </v-card-title>

    <v-card-subtitle
      v-if="value.crewNumber && value.maxCrewNumber"
      class="subtitle-1"
    >
      {{ value.crewNumber }}
      <span class="overline">/{{ value.maxCrewNumber }}</span>
      Besatzung
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: "VehicleCard",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: {
            type: String,
          },
          picture: {
            type: String,
          },
          crewNumber: {
            type: Number,
          },
          maxCrewNumber: {
            type: Number,
          },
        };
      },
    },
  },
};
</script>
