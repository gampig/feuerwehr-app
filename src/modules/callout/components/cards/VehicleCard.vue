<template>
  <v-card v-bind="$attrs" append-inner>
    <v-img
      v-if="modelValue.pictureUrl"
      :src="modelValue.pictureUrl"
      :alt="modelValue.name"
      height="100px"
    />

    <v-card-title>
      {{ modelValue.name }}
    </v-card-title>

    <v-card-subtitle
      v-if="modelValue.crewNumber && modelValue.maxCrewNumber"
      class="text-subtitle-1"
    >
      {{ modelValue.crewNumber }}
      <span class="text-overline">/{{ modelValue.maxCrewNumber }}</span>
      Besatzung
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: {
    modelValue: {
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
