<template>
  <BasePage page-title="Einsatz" back-button>
    <v-container>
      <v-card>
        <CalloutDetails v-if="callout" />

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed @click="showDeleteDialog = true">
          <v-icon left>mdi-delete</v-icon>
          Löschen
        </v-btn>
      </v-card-actions>
      </v-card>

    <BaseConfirmDialog v-model="showDeleteDialog" @confirm="handleDelete" />
    </v-container>

    <Loading :visible="loading" />
  </BasePage>
</template>

<script>
import Loading from "@/components/Loading";
import makeShowMixin from "@/mixins/ShowMixin";
import CalloutDetails from "../components/CalloutDetails";
import { mapActions, mapState } from "vuex";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";

export default makeShowMixin("Callout", "callouts").extend({
  components: {
    Loading,
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
