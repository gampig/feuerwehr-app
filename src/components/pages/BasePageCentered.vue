<template>
  <BasePage v-bind="$attrs" v-on="$listeners">
    <v-container>
      <v-row justify="center">
        <v-col cols="11" sm="10" md="8" lg="6">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>
