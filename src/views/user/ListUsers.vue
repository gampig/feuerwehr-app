<template>
  <BasePage page-title="Benutzer" navdrawer>
    <template #actions>
      <v-btn icon @click="loadUsers"><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <v-container>
      <v-data-table :headers="headers" :items="users" :loading="loading">
        <template #[`item.displayName`]="{ item }">
          <v-edit-dialog
            size="large"
            persistent
            cancel-text="Abbrechen"
            save-text="Speichern"
            @open="editDisplayName = item.displayName"
            @save="updateDisplayName(item)"
          >
            {{ item.displayName }}
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
            <template #input>
              <v-text-field
                v-model="editDisplayName"
                label="Name"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template #[`item.disabled`]="{ item }">
          <v-checkbox-btn v-model="item.disabled" disabled> </v-checkbox-btn>
        </template>
      </v-data-table>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUsersStore } from "@/stores/users";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { roleConfigById, User } from "@/models/User";

function filterAndMapRoles(roles: string[]): string[] {
  return roles
    .filter((role) => roleConfigById[role]?.hidden != true)
    .map((role) => roleConfigById[role]?.name ?? role);
}

export default defineComponent({
  data() {
    return {
      headers: [
        { text: "Name", value: "displayName" },
        { text: "E-Mail", value: "email" },
        { text: "Deaktiviert", value: "disabled" },
        { text: "Rollen", value: "roles" },
      ],

      editDisplayName: undefined as string | undefined,
    };
  },

  computed: {
    ...mapState(useUsersStore, {
      loading: "loading",
      initialized: "initialized",
      storeUsers: "users",
    }),

    ...mapState(useAuthStore, ["loggedIn"]),

    users(): User[] {
      return this.storeUsers.map((user) => ({
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
      if (this.loggedIn) {
        useUsersStore().fetchAll();
      }
    },

    updateDisplayName(user: User) {
      if (this.editDisplayName) {
        useUsersStore().updateDisplayName(user.uid, this.editDisplayName);
      }
    },
  },
});
</script>
