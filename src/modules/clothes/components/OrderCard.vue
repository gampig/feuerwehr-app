<template>
  <v-card>
    <v-card-text>
      <div class="text--primary">
        {{ person }}
      </div>
      <p class="text-h5 text--primary">
        {{ clothType }}
      </p>

      <div v-if="size" class="mb-3">
        <v-icon left>mdi-ruler</v-icon>
        {{ size }}
      </div>

      <div v-if="count && count >= 2" class="mb-3">
        <v-icon left>mdi-cart-variant</v-icon>
        {{ count }}
      </div>

      <div v-if="totalPrice" class="mb-3">
        <v-icon left>mdi-cash</v-icon>
        {{ formatCurrency(paid || 0) }} / {{ formatCurrency(totalPrice) }} €
      </div>

      <v-timeline class="mt-5" dense>
        <v-timeline-item
          :color="!orderedOn && !doneOn ? 'red' : null"
          :icon-color="!orderedOn && !doneOn ? 'white' : 'grey'"
          dark
          icon="mdi-plus"
          fill-dot
          :class="!orderedOn && !doneOn ? null : 'text--disabled'"
        >
          <div>{{ submittedOn }}</div>
          <div>Eingereicht</div>
        </v-timeline-item>

        <v-timeline-item
          v-if="orderedOn"
          :color="!doneOn ? 'orange' : null"
          :icon-color="!doneOn ? 'white' : 'grey'"
          icon="mdi-package-variant-closed"
          fill-dot
          :class="!doneOn ? null : 'text--disabled'"
        >
          <div>{{ orderedOn }}</div>
          <div>Bestellt</div>
        </v-timeline-item>

        <v-timeline-item v-if="doneOn" color="green" icon="mdi-check" fill-dot>
          <div>{{ doneOn }}</div>
          <div>Erledigt</div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('edit')">Bearbeiten</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 0,
});

export default {
  props: {
    person: { type: String, default: null },
    clothType: { type: String, default: null },
    size: { type: String, default: null },
    count: { type: Number, default: 1 },
    paid: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    submittedOn: { type: String, default: null },
    orderedOn: { type: String, default: null },
    doneOn: { type: String, default: null },
  },

  methods: {
    formatCurrency(value) {
      return formatter.format(value);
    },
  },
};
</script>
