<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { MagnifyingGlassIcon, HomeIcon, DocumentIcon, FolderIcon } from '@heroicons/vue/24/outline';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

import { usePageStore } from '@/stores/page';
import ContextMenu from '@/components/ContextMenu.vue';
import ListView from './ListView.vue';

import type { Ref } from 'vue';
import type { DirectoryTypes, FolderElement, PageElement } from '@/types/Element';

/* =======================================================================================================================================
컨텍스트 메뉴
========================================================================================================================================== */

const contextMenuRef = inject<Ref<InstanceType<typeof ContextMenu>>>('contextMenuRef');

function openContextMenu(e: MouseEvent, item?: DirectoryTypes) {
  if (!contextMenuRef?.value) return;

  if (item) {
    if (item.type === 'page') {
      selectedPage.value = item.id;
      contextMenuRef.value.open(setPageContextMenu(item as PageElement), e.clientX, e.clientY, 170);
    } else {
      contextMenuRef.value.open(setFolderContextMenu(item as FolderElement), e.clientX, e.clientY, 170);
    }
  }

  // 디렉토리 추가
  else {
    contextMenuRef.value.open(setAddContextMenu(), e.clientX, e.clientY, 120);
  }
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

function setFolderContextMenu(folder: FolderElement) {
  return [
    {
      id: 'folder:rename',
      label: '폴더명 변경',
      shortcut: '⌘R',
      exec: () => onStartRename(folder)
    },
    {
      id: 'folder:clone',
      label: '폴더 복제',
      shortcut: '⇧⌘C',
      exec: () => elementStore.cloneElement(folder, store.value)
    },
    {
      id: 'folder:delete',
      label: '폴더 삭제',
      exec: () => elementStore.deleteElement(folder.id, store.value)
    }
  ]
}

function setPageContextMenu(page: PageElement) {
  return [
    {
      id: 'page:rename',
      label: '페이지명 변경',
      shortcut: '⌘R',
      disabled: page.isHome,
      exec: () => onStartRename(page)
    },
    {
      id: 'page:clone',
      label: '페이지 복제',
      shortcut: '⇧⌘C',
      exec: () => elementStore.cloneElement(page, store.value)
    },
    {
      id: 'page:delete',
      label: '페이지 삭제',
      disabled: page.isHome,
      exec: () => elementStore.deleteElement(page.id, store.value)
    },
    {
      id: '-'
    },
    {
      id: 'page:set-home',
      label: '홈페이지로 변경',
      disabled: page.isHome,
      exec: () => elementStore.setPageAsHome(page.id)
    }
  ];
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
      children: { list: [], detail: {} }
    };
    store.value.detail[id] = newFolder;
  } else {
    const newPage: PageElement = {
      id: id,
      parentId: '',
      type: 'page',
      name: 'page',
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

// rename 기능 ------------------------------------------------------------------------------------------------------------------------------------

const isNameEditing = ref('');
const newDirectoryName = ref('');

function onStartRename(directory: DirectoryTypes) {
  if (directory.type === 'page') {
    if ((directory as PageElement).isHome) return;
  }

  isNameEditing.value = directory.id;
  newDirectoryName.value = directory.name;

  // Rename 시작 시 자동 포커스
  setTimeout(() => {
    const input = document.getElementById(`input-${directory.id}`) as HTMLInputElement;
    if (input) input.focus();
  }, 0);
}

function onDoneRename(directory: DirectoryTypes) {
  if (newDirectoryName.value?.trim()?.length) {
    directory.name = newDirectoryName.value
  }
  newDirectoryName.value = '';
  isNameEditing.value = '';
}

/* =======================================================================================================================================
검색
========================================================================================================================================== */

const elementStore = usePageStore();
const { store, selectedPage } = storeToRefs(elementStore);

const srchKeyword = ref('');
const searchResult = ref<string[]>(store.value.list);
const filteredList = computed(() => {
  // console.log('computed')
  if (srchKeyword.value?.length) return searchResult.value;
  else return store.value.list;
})

function onSearchPage() {
  const result = elementStore.findElementByName(srchKeyword.value, store.value);
  // console.log('srch result', result.filter(e => e.type === 'page' || e.type === 'folder'));
  searchResult.value = result.filter(e => e.type === 'page' || e.type === 'folder').map(p => p.id);
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
    <ListView v-if="filteredList.length" :list="filteredList" :level="store" :depth="1" />
    <!-- <template v-if="filteredList.length">
      <div 
        v-for="id in filteredList" 
        class="page-item" 
        :class="id === selectedPage && 'selected'" 
        :key="id"
        @click="selectedPage = id"
        @contextmenu.prevent="openContextMenu($event, store.detail[id])"
      >
        <div class="page-icon center">
          <template v-if="store.detail[id].type === 'page'">
            <HomeIcon v-if="(store.detail[id] as PageElement).isHome" />
            <DocumentIcon v-else />
          </template>
          <FolderIcon v-else/>
        </div>

        <div class="page-label" @dblclick="onStartRename(store.detail[id])">
          <input 
            v-if="isNameEditing === id" 
            :id="'input-' + id"
            autofocus 
            type="text" 
            v-model="newDirectoryName" 
            @blur="onDoneRename(store.detail[id])"
            @keydown.enter="onDoneRename(store.detail[id])"
          />
          <div v-else>
            {{ store.detail[id].name }}
          </div>
        </div>
      </div>
    </template> -->

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