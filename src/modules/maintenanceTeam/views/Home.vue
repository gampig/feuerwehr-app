<template>
  <BasePage page-title="Gerätewart" navdrawer>
    <v-container>
      <v-card>
        <v-list>
          <v-list-item v-for="(meeting, index) in meetings" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                {{ meeting.start.toLocaleString() }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="meeting.end">
                bis {{ meeting.end.toLocaleString() }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="meeting.numHelpers && meeting.numHelpers > 0"
              >
                {{ meeting.numHelpers }} Helfer
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      meetings: [
        {
          start: new Date("2021-07-27T19:00"),
          end: new Date(Date.now()),
          numHelpers: 3,
        },
        {
          start: new Date(Date.now()),
        },
      ],
    };
  },
});
</script>
