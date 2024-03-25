<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

import { usePageStore } from '@/stores/page';
import ContextMenu from '@/components/ContextMenu.vue';
import ListView from './ListView.vue';

import type { Ref } from 'vue';
import type { ElementTypes, FolderElement, PageElement } from '@/types/Element';

/* =======================================================================================================================================
컨텍스트 메뉴
========================================================================================================================================== */

const contextMenuRef = inject<Ref<InstanceType<typeof ContextMenu>>>('contextMenuRef');

function openContextMenu(e: MouseEvent) {
  if (!contextMenuRef?.value) return;
  contextMenuRef.value.open(setAddContextMenu(), e.clientX, e.clientY, 120);
}

function setAddContextMenu() {
  return [
    {
      id: 'add:folder',
      label: '새 폴더',
      exec: () => addDirectory('folder')
    },
    {
      id: 'add:page',
      label: '새 페이지',
      exec: () => addDirectory('page')
    }
  ]
}

// add 기능 ------------------------------------------------------------------------------------------------------------------------------------

function addDirectory(type: 'folder' | 'page') {
  const id = uuidv4();
  store.value.list.push(id);

  if (type === 'folder') {
    const newFolder: FolderElement = {
      id: id,
      parentId: '',
      type: 'folder',
      name: 'folder',
      fold: false,
      children: { list: [], detail: {} }
    };
    store.value.detail[id] = newFolder;
  } else {
    const newPage: PageElement = {
      id: id,
      parentId: '',
      type: 'page',
      name: 'page',
      fold: false,
      children: { list: [], detail: {} },
      scale: 1,
      x: 0,
      y: 0,
      width: 1920,
      height: 1080
    }
    store.value.detail[id] = newPage;
  }
}

/* =======================================================================================================================================
검색
========================================================================================================================================== */

const elementStore = usePageStore();
const { store } = storeToRefs(elementStore);

const srchKeyword = ref('');
const searchResult = ref<ElementTypes[]>(Object.values(store.value.detail));
const filteredList = computed(() => {
  console.log('filteredList computed', searchResult.value, Object.values(store.value.detail));
  if (srchKeyword.value?.length) return searchResult.value;
  else return Object.values(store.value.detail);
})

function onSearchPage() {
  const result = elementStore.findElementByName(srchKeyword.value, store.value);
  console.log('search result: ', result.filter(e => e.type === 'page' || e.type === 'folder'));
  searchResult.value = result.filter(e => e.type === 'page' || e.type === 'folder');
}
</script>

<template>
  <div class="lnb-page__header">
    <!-- 항목 검색 -->
    <div class="search-container center">
      <MagnifyingGlassIcon class="search-icon" />
      <input type="text" class="search-input" placeholder="Find..." v-model="srchKeyword" @input="onSearchPage">
    </div>

    <!-- 추가 버튼 -->
    <PlusCircleIcon v-if="!srchKeyword?.length" @click="openContextMenu" class="header-icon center"/>
  </div>

  <div class="lnb-page__body">
    <ListView v-if="filteredList.length" :list="filteredList" :depth="1" />

    <!-- 검색 결과 미존재 시 -->
    <div v-else class="page-item no-result">No results</div>
  </div>
</template>

<style scoped lang="scss">
.lnb-page__header {
  display: flex;
  padding: 20px 15px;
  align-items: center;
  justify-content: space-between;
  height: 64px; 

  .search-container {
    padding-right: 15px;
    border-bottom: 1px solid  #e6e6e6;
    padding: 5px;

    .search-icon {
      width: 13px;
      height: 13px;
      margin-right: 5px;
    }

    .search-input {
      border: none;
      outline: none;
    }
  }

  .header-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}

.lnb-page__body > .page-item {
  display: flex;
  padding: 5px 15px;
  align-items: center;
  cursor: pointer;
  border: 1px solid #fff;
  font-size: 13px;
  cursor: pointer;

  &.selected {
    background-color: #e5f4ff;
    border: 1px solid #e5f4ff;
  }

  &.no-result {
    color: #595959;
  }

  .page-icon {
    width: 14px;
    height: 14px;
    margin-right: 14px;
  }

  .page-label {
    width: 100%;
  }
}

.lnb-page__body > .page-item:hover {
  border: 1px solid #0e81e6;
}
</style>