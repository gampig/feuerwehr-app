<template>
  <v-card v-bind="$attrs" v-on="$listeners">
    <v-toolbar color="secondary" dark flat>
      <v-toolbar-title>
        {{ person }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('delete')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-select
        :value="role"
        :items="roles"
        label="Funktion"
        :loading="loading"
        :disabled="loading"
        clearable
        @input="update"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { getName } from "@/modules/fireDepartment/utils/people";
/* eslint-disable no-unused-vars */
import Vue, { PropType } from "vue";
import { Person } from "@/modules/fireDepartment/models/Person";
import { ROLES, Role } from "../../models/Callout";
/* eslint-enable */

export default Vue.extend({
  props: {
    person: {
      type: String,
      required: true,
    },

    role: {
      type: String as PropType<Role>,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      roles: ROLES,
    };
  },

  methods: {
    getName,
    update(role: Role): void {
      this.$emit("input", role);
    },
  },
});
</script>
