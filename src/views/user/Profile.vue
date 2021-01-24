<template>
  <BasePageCentered page-title="Profil" navdrawer>
    <v-form @submit.prevent="submit">
      <v-card :disabled="loading">
        <v-list-item>
          <BaseListItemUserAvatar
            :src="user && user.photoURL"
          ></BaseListItemUserAvatar>
          <v-list-item-content>
            <v-list-item-title>{{
              user && user.displayName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              user && user.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-text>
          <v-select
            v-if="item.roles"
            v-model="item.roles"
            :items="validRoles"
            label="Rollen"
            multiple
            chips
            :disabled="!roles || !roles.ROLE_ADMIN"
          ></v-select>
          <v-text-field v-model="item.displayName" label="Name" />
          <v-text-field v-model="item.photoURL" label="Profilbild" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" :loading="loading" color="primary">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </BasePageCentered>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      loading: false,

      validRoles: [
        { text: "Admin", value: "ROLE_ADMIN", disabled: true },
        { text: "Gruppenführer", value: "ROLE_GROUPLEADER" },
        { text: "Kleiderwart", value: "ROLE_MAINTAINER_CLOTHES" },
        { text: "Fahrzeug", value: "ROLE_VEHICLE" },
      ],
    };
  },

  computed: {
    ...mapState("auth", ["loggedIn", "user", "userSettings"]),

    item() {
      const item = {
        roles: this.rolesArray,
        displayName: (this.user && this.user.displayName) || "",
        photoURL: (this.user && this.user.photoURL) || "",
      };
      return item;
    },

    roles() {
      return (this.userSettings && this.userSettings.roles) || {};
    },

    rolesArray() {
      return Object.keys(this.roles) || [];
    },
  },

  methods: {
    ...mapActions("auth", ["updateProfile", "updateRoles"]),

    submit() {
      this.loading = true;
      if (this.roles.ROLE_ADMIN === true) {
        const rolesObject = Object.fromEntries(
          this.item.roles.map((item) => [item, true])
        );
        this.updateRoles(rolesObject);
      }

      this.updateProfile(this.item).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
