<template>
  <v-row>
    <v-col md="6" lg="4" cols="12">
      <v-text-field
        label="Suche"
        :search="search"
        prepend-inner-icon="mdi-magnify"
        solo
        dense
        single-line
        hide-details
        clearable
        @input="$emit('update:search', $event)"
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
