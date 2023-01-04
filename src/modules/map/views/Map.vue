<template>
  <page page-title="Karte" navdrawer>
    <l-map :zoom.sync="zoom" :center.sync="center" style="height: 100%">
      <l-tile-layer :url="url" />
      <l-marker
        v-for="(position, name) in positions"
        :key="name"
        :lat-lng="[position.lat, position.lon]"
      >
        <l-icon>
          <div class="dot">{{ name[0] }}</div>
        </l-icon>
      </l-marker>
    </l-map>
  </page>
</template>

<style scoped>
.dot {
  text-align: center;
  line-height: 15px;
  height: 15px;
  width: 15px;
  font-weight: 800;
  color: black;
  background: red 50%;
  border-radius: 100%;
}
.center {
  margin: auto;
}
</style>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";
import NotificationMixin from "@/mixins/NotificationMixin";

export default {
  mixins: [NotificationMixin],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },

  data() {
    return {
      zoom: 13,
      center: latLng(48.9193653, 12.5973454),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      showParagraph: false,
      showMap: true,

      positions: {},
      token: "7784b80cc5de772d7ee84e3832921084",
      positionsEndpoint:
        "https://cloud.feuerwehr-parkstetten.de/index.php/apps/phonetrack/api/getlastpositions/7784b80cc5de772d7ee84e3832921084",
      positionUpdateInterval: 10000,
      positionTimer: null
    };
  },

  methods: {
    fetchPositions() {
      fetch(this.positionsEndpoint)
        .then(response => response.json())
        .then(data => {
          this.positions = data[this.token];
        })
        .catch(error => {
          this.showError(error);
        });
    }
  },

  created() {
    this.fetchPositions();
    this.positionTimer = setInterval(
      () => this.fetchPositions,
      this.positionUpdateInterval
    );
  },

  destroyed() {
    clearTimeout(this.positionTimer);
  }
};
</script>
