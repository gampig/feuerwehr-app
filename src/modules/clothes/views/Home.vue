<template>
  <BasePage page-title="Kleidung" extended navdrawer>
    <template #actions>
      <v-btn icon @click="reload"><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <template #extension>
      <v-tabs fixed-tabs>
        <v-tab :to="{ name: 'ClothesOrders' }">
          <v-icon left>mdi-cart</v-icon>
          Bestellungen
        </v-tab>
        <v-tab :to="{ name: 'ClothesTypes' }">
          <v-icon left>mdi-tshirt-crew</v-icon>
          Kleidung
        </v-tab>
      </v-tabs>
    </template>

    <router-view></router-view>
  </BasePage>
</template>

<script>
import modules from "@/modules";

export default {
  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
