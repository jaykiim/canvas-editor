<script setup lang="ts">
import GnbView from './gnb/GnbView.vue';
import LnbView from './lnb/LnbView.vue';
import CanvasView from './canvas/CanvasView.vue';
</script>

<template>
  <GnbView />
  <div class="editor-container">
    <LnbView />
    <CanvasView />
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  display: flex;
  width: 100%;
  height: calc(100% - 3rem);
}
</style>