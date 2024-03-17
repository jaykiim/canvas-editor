<script setup lang="ts">
import { ref } from 'vue';
import type { ContextMenuItem } from '@/types/Editor';

const visible = ref(false);
const menuItems = ref<ContextMenuItem[]>();
const clientX = ref(0);
const clientY = ref(0);
const width = ref(0);

function open(menu: ContextMenuItem[], x: number, y: number, w: number) {
  visible.value = true;
  menuItems.value = menu;
  clientX.value = x;
  clientY.value = y;
  width.value = w;
}

function onClickMenu(menu: ContextMenuItem) {
  if (menu.exec) {
    menu.exec();
  }
  visible.value = false;
}

defineExpose({ open });
</script>

<template>
  <div v-if="visible" class="context-menu__cradle" @mousedown.stop="visible = false">
    <div class="context-menu" :style="{ left: clientX + 'px', top: clientY + 'px', width: width + 'px' }">
      <div v-for="menu in menuItems" :key="menu.id">
        <div v-if="menu.id === '-'" class="line"></div>

        <div v-else class="item" :class="menu.disabled && 'disabled'" @mousedown.stop="!menu.disabled && onClickMenu(menu)">  
          <div>{{ menu.label }}</div>
          <div>{{ menu.shortcut }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.context-menu__cradle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 21000;
}
.context-menu {
  position: absolute;
  background-color: #1e1e1e;
  color: #f3f3f3;
  border-radius: 3px;
  font-size: 13px;
  padding: 10px 0;

  .item {
    display: flex;
    justify-content: space-between;
    padding: 5px 15px;

    &.disabled {
      color: #777777;
      &:hover {
        cursor: not-allowed;
        background-color: #1e1e1e;
      }
    }
  }

  .item:hover {
    background-color: #0a99fe;
    cursor: pointer;
  }

  .item:last-child {
    margin-bottom: 0px;
  }

  .line {
    width: 100%;
    border-bottom: 1px solid #3a3a3a;
    margin: 10px 0;
  }
}
</style>