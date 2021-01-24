<template>
  <BasePage page-title="Einsatz" back-button>
    <template #actions>
      <v-btn v-if="isAdmin" :to="editRoute" icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-container>
      <BaseToolbar :handle-delete="isAdmin ? del : null">
        <template slot="left">
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
import { mapActions, mapGetters, mapState } from "vuex";

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
    ...mapGetters("auth", ["isAdmin"]),

    editRoute() {
      return { name: "CalloutUpdate", params: { id: this.id } };
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
        this.showMessage("Objekt wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
