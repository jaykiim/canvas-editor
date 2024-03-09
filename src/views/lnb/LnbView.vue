<script setup lang="ts">
import { ref } from 'vue';
import LnbPageView from './LnbPageView.vue';
import LnbLayerView from './LnbLayerView.vue';
import LnbAssetView from './LnbAssetView.vue';
import type { LnbTabInterface } from '@/types/Editor';
import type { Keyof } from '@/types/utils';

// 탭 정의
const tabs: LnbTabInterface<'page' | 'layer' | 'asset'> = {
  list: ['page', 'layer', 'asset'],
  data: {
    page: {
      component: LnbPageView,
      label: 'Pages'
    },
    layer: {
      component: LnbLayerView,
      label: 'Layers'
    },
    asset: {
      component: LnbAssetView,
      label: 'Assets'
    },
  }
}

// 현재 탭
const current = ref(tabs.list[0]);

// 탭 변경 함수
function onClickTab(tab: Keyof<typeof tabs.data>) {
  current.value = tab;
}
</script>

<template>
  <div class="lnb-container">

    <!-- 탭 리스트 -->
    <div class="tab-container">
      <div 
        v-for="tab of tabs.list" 
        :key="tab"
        :class="tab === current ? 'selected' : ''" 
        class="tab-item"
        @click="onClickTab(tab)"
      >
        {{ tab }}
      </div>
    </div>

    <!-- 탭 컨텐츠 -->
    <div class="tab-content">
      <component :is="tabs.data[current].component" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lnb-container {
  width: 240px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  
}
.tab-container {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  .tab-item {
    color: #ababab;
    font-weight: bold;
    font-size: 0.8rem;
    cursor: pointer;
    &.selected {
      color: #333;
    }
  
    &:hover {
      color: #333;
    }
  }
}

.tab-content {
  padding: 10px 15px;
}
</style>