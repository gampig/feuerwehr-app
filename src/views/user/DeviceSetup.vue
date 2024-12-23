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

    <v-form v-else ref="form">
      <LoginCard
        v-model:email="email"
        v-model:password="password"
        card-title="Gerät anmelden"
      >
        <v-spacer />
        <v-btn color="primary" @click="handleSubmit"> Speichern </v-btn>
      </LoginCard>
    </v-form>
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
      email: "",
      password: "",
    };
  },

  methods: {
    async handleSubmit() {
      const form = this.$refs.form;
      if (form && (await form.validate()).valid) {
        const device = { email: this.email, password: this.password };
        deviceService.set(device);
        this.device = device;
      }
    },

    handleLogout() {
      deviceService.remove();
      this.device = null;
    },
  },
};
</script>
