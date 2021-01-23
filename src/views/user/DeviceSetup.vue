<template>
  <page-centered page-title="Gerät einrichten" navdrawer>
    <v-card v-if="device">
      <v-toolbar color="green" dark flat>
        <v-toolbar-title>Gerät ist angemeldet</v-toolbar-title>
      </v-toolbar>
      <v-card-title>{{ device.email }}</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleLogout" text>Abmelden</v-btn>
      </v-card-actions>
    </v-card>

    <login-card v-else @input="handleSubmit" card-title="Gerät anmelden">
      <v-spacer />
      <v-btn type="submit" color="primary"> Speichern </v-btn>
    </login-card>
  </page-centered>
</template>

<script>
import deviceService from "@/services/device";
import LoginCard from "@/components/user/LoginCard";

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
