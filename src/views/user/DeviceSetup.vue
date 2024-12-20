<template>
  <BasePageCentered page-title="Gerät einrichten" navdrawer>
    <v-card v-if="device">
      <v-toolbar color="green" dark flat>
        <v-toolbar-title>Gerät ist angemeldet</v-toolbar-title>
      </v-toolbar>
      <v-card-title>{{ device.email }}</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="handleLogout">Abmelden</v-btn>
      </v-card-actions>
    </v-card>

    <LoginCard
      v-else
      card-title="Gerät anmelden"
      @update:model-value="handleSubmit"
    >
      <v-spacer />
      <v-btn type="submit" color="primary"> Speichern </v-btn>
    </LoginCard>
  </BasePageCentered>
</template>

<script>
import deviceService from "@/services/device";
import LoginCard from "@/components/user/LoginCard.vue";

export default {
  components: {
    LoginCard,
  },

  data() {
    return {
      device: deviceService.get(),
    };
  },

  methods: {
    handleSubmit(device) {
      deviceService.set(device);
      this.device = device;
    },

    handleLogout() {
      deviceService.remove();
      this.device = null;
    },
  },
};
</script>
