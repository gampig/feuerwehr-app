<template>
  <BasePage page-title="Kleidung" extended navdrawer>
    <template #extension>
      <v-tabs fixed-tabs>
        <v-tab :to="{ name: 'ClothesOrders' }" replace>
          <v-icon start>mdi-cart</v-icon>
          Bestellungen
        </v-tab>
        <v-tab :to="{ name: 'ClothesTypes' }" replace>
          <v-icon start>mdi-tshirt-crew</v-icon>
          Kleidung
        </v-tab>
      </v-tabs>
    </template>

    <router-view></router-view>
  </BasePage>
</template>
