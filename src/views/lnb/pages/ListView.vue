<script setup lang="ts">
import { inject, ref, type PropType, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { HomeIcon, DocumentIcon, FolderIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

import { usePageStore } from '@/stores/page';
import ContextMenu from '@/components/ContextMenu.vue';

import type { DirectoryTypes, ElementTypes, FolderElement, PageElement } from '@/types/Element';

defineProps({
  list: { type: Array as PropType<ElementTypes[]>, required: true },
  depth: { type: Number, required: true }
});

const elementStore = usePageStore();
const { store, selectedPage } = storeToRefs(elementStore);

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
    directory.name = newDirectoryName.value;
  }
  newDirectoryName.value = '';
  isNameEditing.value = '';
}

/* =======================================================================================================================================
항목 펼치기 / 접기
========================================================================================================================================== */

function hasChildrenDirectory(element: DirectoryTypes) {
  return Object.values(element.children.detail).find(child => child.type === 'page' || child.type === 'folder');
}

function toggleFold(element: DirectoryTypes) {
  element.fold = !element.fold;
}

/* =======================================================================================================================================
드래그 앤 드랍
========================================================================================================================================== */

/*

@dragstart, @drop: .page-item에 등록
@dragover: .lnb-page__header (리스트 컨테이너 div) 영역 넘어갈 경우 firstChild 또는 lastChild에 가이드 표시하기 위해 전역 등록
@dragleave: mousemove, el.elementFromPoint(x, y)로 구현

*/

const dragging = ref<{ element?: DirectoryTypes, div?: HTMLDivElement }>({ element: undefined, div: undefined });

function onMousedown(e: MouseEvent, element: DirectoryTypes) {
  if (element.type === 'page') {
    selectedPage.value = element.id;
  }
}

function onMouseup(e: MouseEvent, element: DirectoryTypes) { 
}

function onDragStart(e: DragEvent, element: DirectoryTypes) {
  e.dataTransfer?.setDragImage(new Image, 0, 0); // 드래그 이미지 제거
  
  const div = e.target as HTMLDivElement;

  dragging.value.element = element;
  dragging.value.div = div;
}

function onDragLeave(e: DragEvent, element: DirectoryTypes) {
  console.log('leave', element.name);
}

function onDragEnter(e: DragEvent, element: DirectoryTypes) {
  // console.log('enter', element.name);
}

function onDrop(e: DragEvent, element: DirectoryTypes) {
}
</script>

<template>
  <template v-for="element of list" :key="element.id">
    <div 
      v-if="element.type === 'page' || element.type === 'folder'"
      class="page-item" 
      :class="element.id === selectedPage && 'selected'" 
      :style="{ paddingLeft: 7 + depth * 20 + 'px' }"
      draggable="true"
      @mousedown.stop="onMousedown($event, element as DirectoryTypes)"
      @mouseup.stop="onMouseup($event, element as DirectoryTypes)"
      @dragstart.stop="onDragStart($event, element as DirectoryTypes)"
      @dragleave.stop="onDragLeave($event, element as DirectoryTypes)"
      @dragenter.stop="onDragEnter($event, element as DirectoryTypes)"
      @drop.stop="onDrop($event, element as DirectoryTypes)"
      @contextmenu.prevent="openContextMenu($event, element as DirectoryTypes)"
    >
      <!-- 아이콘 -->
      <div class="center icon-container">
        <!-- 펼치기 / 접기 -->
        <template v-if="hasChildrenDirectory(element as DirectoryTypes)">
          <ChevronRightIcon v-if="!(element as DirectoryTypes).fold" class="fold-icon" @click="toggleFold(element as DirectoryTypes)"/>
          <ChevronDownIcon v-else class="fold-icon" @click="toggleFold(element as DirectoryTypes)" />
        </template>

        <!-- 페이지 -->
        <template v-if="element.type === 'page'">
          <HomeIcon v-if="(element as PageElement).isHome" class="page-icon" />
          <DocumentIcon v-else class="page-icon"/>
        </template>
        <!-- 폴더 -->
        <FolderIcon v-else class="page-icon" />
      </div>

      <!-- 항목명 -->
      <div class="page-label" @dblclick="onStartRename(element as DirectoryTypes)">
        <input 
          v-if="isNameEditing === element.id" 
          :id="'input-' + element.id"
          autofocus 
          type="text" 
          v-model="newDirectoryName" 
          @blur="onDoneRename(element as DirectoryTypes)"
          @keydown.enter="onDoneRename(element as DirectoryTypes)"
        />
        <div v-else>
          {{ element.name }}
        </div>
      </div>
    </div>

    <ListView 
      v-if="element.children.list.length && (element as DirectoryTypes).fold" 
      :list="Object.values(element.children.detail)" 
      :depth="depth + 1"
    />
  </template>
</template>

<style scoped lang="scss">
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

  .icon-container {
    position: relative;
  }

  .page-icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }

  .fold-icon {
    position: absolute;
    top: 50%;
    left: -20px;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    transform: translate(0, -50%);
  }

  .page-label {
    width: 100%;
  }
}

.lnb-page__body > .page-item:hover {
  &:not(.selected, .dragging) {
    border: 1px solid #0e81e6;
  }
}
</style>