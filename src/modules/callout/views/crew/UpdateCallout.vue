<template>
  <CrewPage
    page-title="Einsatz bearbeiten"
    :loading="saving"
    save-button
    @submit="submit"
  >
    <v-card :loading="loading">
      <v-card-text>
        <CalloutForm
          ref="form"
          v-model:type="item.type"
          v-model:keyword="item.keyword"
          v-model:catchphrase="item.catchphrase"
          v-model:alarm-time="item.alarmTime"
          v-model:address="item.address"
          require-keyword
          :limit-alarm-time-to-recently="!canEditAllCallouts"
        />
      </v-card-text>
    </v-card>
  </CrewPage>
</template>

<script lang="ts">
import CrewPage from "../../components/CrewPage.vue";
import CalloutForm from "../../components/form/Form.vue";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";
import { defineComponent } from "vue";
import { Callout } from "../../models/Callout";
import handleError from "@/utils/store/handleError";
import { VForm } from "vuetify/components";
import { mapActions, mapState } from "pinia";
import { useCalloutStore } from "../../stores/callout";

export default defineComponent({
  components: {
    CrewPage,
    CalloutForm,
  },

  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      saving: false,
      item: {} as Callout,
      emptyItem: {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        address: null,
      },
    };
  },

  computed: {
    ...mapState(useCalloutStore, ["callout"]),

    canEditAllCallouts() {
      const authStore = useAuthStore();
      return (
        authStore.loggedIn && authStore.hasAnyRole(Acl.alleEinsaetzeBearbeiten)
      );
    },
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.setItem();
      }
    },
  },

  created() {
    this.setItem();
  },

  methods: {
    ...mapActions(useCalloutStore, ["updateCallout"]),

    setItem() {
      this.item = Object.assign({}, this.emptyItem, this.callout);
    },

    async submit() {
      if (
        (
          await (
            (this.$refs.form as typeof CalloutForm).$refs.form as VForm
          ).validate()
        ).valid
      ) {
        const submittedData = this.item;

        if (!submittedData.id) {
          handleError("Einsatz-Id ist nicht bekannt.");
          return;
        }

        this.saving = true;
        this.updateCallout(submittedData)
          .then(() => this.next(this.callout?.id ?? submittedData.id))
          .finally(() => {
            this.saving = false;
          });
      }
    },

    updateRoute(calloutId: string) {
      this.$router.replace({
        name: this.$route.name,
        params: { callout_id: calloutId },
      });
    },

    next(calloutId: string) {
      const vehicle = useCalloutStore().vehicle;
      if (vehicle) {
        this.$router.push({
          name: "CrewVehicleDetails",
          params: {
            callout_id: calloutId,
            vehicle_id: vehicle.id,
          },
        });
      } else {
        this.$router.push({
          name: "CrewVehicles",
          params: {
            callout_id: calloutId,
          },
        });
      }
    },
  },
});
</script>
