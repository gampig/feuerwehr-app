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

<script lang="ts">
import CalloutDetails from "../components/CalloutDetails.vue";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { useCalloutStore } from "../stores/callout";

export default defineComponent({
  components: {
    CalloutDetails,
  },

  data() {
    return {
      showDeleteDialog: false,
    };
  },

  computed: {
    ...mapState(useCalloutStore, ["callout", "loading"]),

    id() {
      return this.$route.params.id as string;
    },

    userCanDeleteCallout() {
      const authStore = useAuthStore();
      return authStore.loggedIn && authStore.hasAnyRole(Acl.einsatzLoeschen);
    },
  },

  watch: {
    id() {
      this.retrieveItem();
    },
  },

  mounted() {
    this.retrieveItem();
  },

  methods: {
    ...mapActions(useCalloutStore, ["selectCallout", "deleteSelectedCallout"]),

    goBack() {
      this.$router.back();
    },

    retrieveItem() {
      this.selectCallout(this.id);
    },

    handleDelete() {
      this.deleteSelectedCallout().then(() => {
        this.$showMessage("Einsatz wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
