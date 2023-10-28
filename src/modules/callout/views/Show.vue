<template>
  <BasePage page-title="Einsatz" back-button>
    <v-container>
      <BaseToolbar :handle-delete="userCanDeleteCallout ? del : null">
        <template #left>
          <v-toolbar-title v-if="callout">
            {{ callout.keyword }} -
            {{ callout.alarmTime | formatDateTime }}
          </v-toolbar-title>
        </template>
      </BaseToolbar>

      <v-card>
        <CalloutDetails v-if="callout" />
      </v-card>
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
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),

    userCanDeleteCallout() {
      return useAuthStore().hasAnyRole(Acl.einsatzLoeschen);
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
    del() {
      this.remove().then(() => {
        this.$showMessage("Einsatz wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
