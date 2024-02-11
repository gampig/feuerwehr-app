<template>
  <BasePage page-title="Benutzer" navdrawer>
    <template #actions>
      <v-btn icon @click="loadUsers"><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <v-container>
      <v-data-table :headers="headers" :items="users" :loading="loading">
        <template #[`item.disabled`]="{ item }">
          <v-simple-checkbox v-model="item.disabled" disabled>
          </v-simple-checkbox>
        </template>
      </v-data-table>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import Vue from "vue";
import { useUsersStore } from "@/stores/users";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { roleConfigById, User } from "@/models/User";

function filterAndMapRoles(roles: string[]): string[] {
  return roles
    .filter((role) => roleConfigById[role]?.hidden != true)
    .map((role) => roleConfigById[role]?.description ?? role);
}

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Name", value: "displayName" },
        { text: "E-Mail", value: "email" },
        { text: "Deaktiviert", value: "disabled" },
        { text: "Rollen", value: "roles" },
      ],
    };
  },

  computed: {
    ...mapState(useUsersStore, ["loading", "initialized"]),
    ...mapState(useAuthStore, ["loggedIn"]),

    users(): User[] {
      return useUsersStore().users.map((user) => ({
        ...user,
        roles: filterAndMapRoles(user.roles),
      }));
    },
  },

  watch: {
    loggedIn() {
      this.loadUsersIfNeeded();
    },
  },

  mounted() {
    this.loadUsersIfNeeded();
  },

  methods: {
    loadUsersIfNeeded() {
      if (!this.initialized) {
        this.loadUsers();
      }
    },

    loadUsers() {
      useUsersStore().fetchAll();
    },
  },
});
</script>
