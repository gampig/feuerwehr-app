<template>
  <v-row>
    <v-col md="6" lg="4" cols="12">
      <v-text-field
        label="Suche"
        :search="search"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        density="compact"
        hide-details
        clearable
        @update:model-value="$emit('update:search', $event)"
      ></v-text-field>
    </v-col>

    <slot />
  </v-row>
</template>

<script>
export default {
  props: {
    search: {
      type: String,
      default: "",
    },
  },
};
</script>
