<script setup lang="ts">
import { useElementStore } from '@/stores/page';
import { storeToRefs } from 'pinia';

const { elementStore } = storeToRefs(useElementStore());
</script>

<template>
  <div>page</div>
</template>