<script setup lang="ts">
import { useElementStore } from '@/stores/page';
import { storeToRefs } from 'pinia';

const elementStore = useElementStore();
const { store } = storeToRefs(elementStore);
</script>

<template>
  <div class="lnb-page__header" @click="elementStore.addPage">+</div>
  <div class="lnb-page__body">
    <div class="page-item" v-for="id in store.list" :key="id">
      {{ store.detail[id].name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>