<script setup lang="ts">
import { ref } from 'vue';
import LnbPageView from './pages/LnbPagesView.vue';
import LnbLayerView from './layers/LnbLayersView.vue';
import LnbAssetView from './assets/LnbAssetsView.vue';
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
        {{ tabs.data[tab].label }}
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
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  
  .tab-item {
    flex: 1;
    padding: 7px 15px;
    border-right: 1px solid #e6e6e6;
    text-align: center;

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

  .tab-item:last-child {
    border-right: none;
  }
}

.tab-content {
  // padding: 10px 15px;
}
</style>./assets/LnbAssetsView.vue