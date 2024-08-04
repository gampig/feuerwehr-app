<template>
  <BasePage page-title="Benutzer" navdrawer>
    <template #actions>
      <v-btn icon @click="loadUsers"><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <v-container>
      <v-data-table :headers="headers" :items="users" :loading="loading">
        <template #[`item.displayName`]="{ item }">
          <v-edit-dialog
            large
            persistent
            cancel-text="Abbrechen"
            save-text="Speichern"
            @open="editDisplayName = item.displayName"
            @save="updateDisplayName(item)"
          >
            {{ item.displayName }}
            <template #input>
              <v-text-field
                v-model="editDisplayName"
                label="Name"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template #[`item.disabled`]="{ item }">
          <v-simple-checkbox v-model="item.disabled" disabled>
          </v-simple-checkbox>
        </template>

        <template #[`item.roles`]="{ item }">
          <v-edit-dialog
            large
            persistent
            cancel-text="Abbrechen"
            save-text="Speichern"
            @open="editRoles = item.roles"
            @save="updateRoles(item)"
          >
            <v-chip-group>
              <v-chip v-for="role in item.roles" :key="role" small>
                {{ role }}
              </v-chip>
            </v-chip-group>
            <template #input>
              <v-chip-group
                :value="selectedRoles"
                multiple
                active-class="primary"
                @change="changeSelectedRoles"
              >
                <v-chip v-for="role in allRoles" :key="role">
                  {{ role }}
                </v-chip>
              </v-chip-group>
            </template>
          </v-edit-dialog>
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
import { AllRoles, roleConfigById, rolesConfig, User } from "@/models/User";

function filterAndMapRoles(roles: string[]): string[] {
  return roles
    .filter((role) => roleConfigById[role]?.hidden != true)
    .map((role) => roleConfigById[role]?.name ?? role);
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

      allRoles: rolesConfig
        .filter((value) => !value.hidden)
        .map((value) => value.name),

      editDisplayName: "",
      editRoles: [] as AllRoles[],
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

    selectedRoles(): number[] {
      return this.editRoles.map((value) => this.allRoles.indexOf(value));
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
      useUsersStore().updateDisplayName(user.uid, this.editDisplayName);
    },

    updateRoles(user: User) {
      console.log(this.editRoles);
      user.roles = this.editRoles;
    },

    changeSelectedRoles(selectedRoles: number[]) {
      this.editRoles = selectedRoles.map((value) => this.allRoles[value]);
    },
  },
});
</script>
