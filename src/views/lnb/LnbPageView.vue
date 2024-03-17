<script setup lang="ts">
import { inject, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { HomeIcon, DocumentIcon } from '@heroicons/vue/24/outline';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

import { useElementStore } from '@/stores/page';
import ContextMenu from '@/components/ContextMenu.vue';

import type { Ref } from 'vue';
import type { PageElement } from '@/types/Element';

/* =======================================================================================================================================
컨텍스트 메뉴
========================================================================================================================================== */

const contextMenuRef = inject<Ref<InstanceType<typeof ContextMenu>>>('contextMenuRef');

function setContextMenu(page: PageElement) {
  return [
    {
      id: 'page:rename',
      label: '페이지명 변경',
      shortcut: '⌘R',
      disabled: page.default,
      exec: () => {
        newPageName.value = page.name;
        isNameEditing.value = page.id;
      }
    },
    {
      id: 'page:clone',
      label: '페이지 복제',
      shortcut: '⇧⌘C',
    },
    {
      id: 'page:delete',
      label: '페이지 삭제'
    },
    {
      id: '-'
    },
    {
      id: 'page:set-home',
      label: '홈페이지로 변경',
      disabled: page.default
    }
  ];
}

function openPageContextMenu(e: MouseEvent, page: PageElement) {
  if (!contextMenuRef?.value) return;
  contextMenuRef.value.open(setContextMenu(page), e.clientX, e.clientY, 200);
}

const isNameEditing = ref('');
const newPageName = ref('');

function renamePage(page: PageElement) {
  if (newPageName.value?.length) {
    page.name = newPageName.value
  }
  newPageName.value = '';
  isNameEditing.value = '';
}

/* =======================================================================================================================================
검색
========================================================================================================================================== */

const elementStore = useElementStore();
const { store, selectedPage } = storeToRefs(elementStore);

const srchKeyword = ref('');
const filteredList = ref<string[]>(store.value.list);

function onSearchPage() {
  const filteredPages = elementStore.findPageByName(srchKeyword.value);
  filteredList.value = filteredPages.map(p => p.id);
}
</script>

<template>
  <div class="lnb-page__header">
    <!-- 항목 검색 -->
    <div class="search-container">
      <input type="text" class="search-input" placeholder="Find..." v-model="srchKeyword" @input="onSearchPage">
    </div>

    <!-- 추가 버튼 -->
    <PlusCircleIcon @click="elementStore.addPage" class="header-icon center"/>
  </div>

  <div class="lnb-page__body">
    <!-- 페이지 항목 -->
    <template v-if="filteredList.length">
      <div 
        v-for="id in filteredList" 
        class="page-item" 
        :class="id === selectedPage && 'selected'" 
        :key="id"
        @click="selectedPage = id"
        @contextmenu.prevent="openPageContextMenu($event, store.detail[id])"
      >
        <!-- 아이콘 -->
        <div class="page-icon center">
          <HomeIcon v-if="store.detail[id].default" />
          <DocumentIcon v-else />
        </div>

        <!-- 페이지명 -->
        <div class="page-label">
          <input 
            v-if="isNameEditing === id" 
            autofocus 
            type="text" 
            v-model="newPageName" 
            @blur="renamePage(store.detail[id])"
            @change="renamePage(store.detail[id])"
          />
          <div v-else>
            {{ store.detail[id].name }}
          </div>
        </div>
      </div>
    </template>

    <!-- 검색 결과 미존재 시 -->
    <div class="page-item no-result" v-else>No results</div>
  </div>
</template>

<style scoped lang="scss">
.lnb-page__header {
  display: flex;
  padding: 20px 15px;
  align-items: center;
  justify-content: space-between;

  .search-container {
    padding-right: 15px;
    border-bottom: 1px solid  #e6e6e6;
    padding: 0 5px;

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
}

.lnb-page__body > .page-item:hover {
  border: 1px solid #0e81e6;
}
</style>