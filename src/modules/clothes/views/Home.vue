<template>
  <page page-title="Kleidung" extended navdrawer>
    <template v-slot:actions>
      <v-btn @click="reload" icon><v-icon>mdi-reload</v-icon></v-btn>
    </template>

    <template v-slot:extension>
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
  </page>
</template>

<script>
import modules from "@/modules";

export default {
  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
