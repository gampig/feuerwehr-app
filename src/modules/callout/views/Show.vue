<template>
  <v-container>
    <v-card :loading="loading">
      <CalloutDetails v-if="callout" />

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn variant="flat" @click="goBack">
          <v-icon start>mdi-arrow-left</v-icon>
          Zurück
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="flat" @click="showDeleteDialog = true">
          <v-icon start>mdi-delete</v-icon>
          Löschen
        </v-btn>
      </v-card-actions>
    </v-card>

    <BaseConfirmDialog v-model="showDeleteDialog" @confirm="handleDelete" />
  </v-container>
</template>

<script>
import makeShowMixin from "@/mixins/ShowMixin";
import CalloutDetails from "../components/CalloutDetails.vue";
import { mapActions, mapState } from "vuex";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";

export default makeShowMixin("Callout", "callouts").extend({
  components: {
    CalloutDetails,
  },

  data() {
    return {
      loading: false,
      showDeleteDialog: false,
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),

    userCanDeleteCallout() {
      const authStore = useAuthStore();
      return authStore.loggedIn && authStore.hasAnyRole(Acl.einsatzLoeschen);
    },
  },

  methods: {
    ...mapActions("callout", ["bind", "remove"]),

    goBack() {
      this.$router.back();
    },

    retrieveItem() {
      this.loading = true;

      return this.bind(this.id).finally(() => {
        this.loading = false;
      });
    },
    handleDelete() {
      this.remove().then(() => {
        this.$showMessage("Einsatz wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
