<template>
  <BasePage page-title="Benutzer" navdrawer>
    <template #actions>
      <v-btn icon @click="loadUsers"><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <v-container>
      <v-data-table :headers="headers" :items="users" :loading="loading">
        <template #[`item.displayName`]="{ item }">
          {{ item.displayName }}
          <v-btn icon variant="text" @click="showEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template #[`item.disabled`]="{ item }">
          <v-checkbox-btn v-model="item.disabled" disabled> </v-checkbox-btn>
        </template>
        <template #[`item.roles`]="{ item }">
          <v-chip-group disabled>
            <v-chip v-for="role in item.roles" :key="role" size="small">
              {{ role }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-data-table>
    </v-container>

    <BaseEditDialog
      v-model="editDialog"
      :saving="saving"
      :title="editItem?.displayName ?? editItem?.email ?? 'Benutzer ändern'"
      @save="updateDisplayName"
    >
      <v-text-field v-model="editDisplayName" label="Name"></v-text-field>
    </BaseEditDialog>
  </BasePage>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
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
        { title: "Name", key: "displayName" },
        { title: "E-Mail", key: "email" },
        { title: "Deaktiviert", key: "disabled" },
        { title: "Rollen", key: "roles" },
      ],

      editDialog: false,
      editItem: undefined as User | undefined,
      editDisplayName: undefined as string | undefined,
      saving: false,
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

    updateDisplayName() {
      if (this.editDisplayName && this.editItem) {
        this.saving = true;
        useUsersStore()
          .updateDisplayName(this.editItem.uid, this.editDisplayName)
          .then(() => {
            this.editDialog = false;
            nextTick(() => {
              this.editItem = undefined;
              this.editDisplayName = undefined;
            });
          })
          .finally(() => {
            this.saving = false;
          });
      }
    },

    showEditDialog(user: User) {
      this.editItem = user;
      this.editDisplayName = user.displayName;
      this.editDialog = true;
    },
  },
});
</script>
