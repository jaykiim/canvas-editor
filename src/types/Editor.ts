/* ==============================================================================================================================
 에디터의 구성과 관련된 타입을 정의한다.
============================================================================================================================== */

import type { Component } from "vue"

// * 공통 --------------------------------------------------------------------------------------------------------------------------------------------

interface ContextMenuItem {
  id: string;
  label?: string;
  shortcut?: string;
  disabled?: boolean;
  exec?: (param?: any) => void;
}

// * LNB --------------------------------------------------------------------------------------------------------------------------------------------

// 탭 정의 --LnbView.vue
interface LnbTabInterface<T extends string> {
  list: T[]; // 전체 탭 목록
  data: {
    [key in T]: LnbTabData;
  };
}

interface LnbTabData {
  component: Component,
  label: string
}

export type { LnbTabInterface, ContextMenuItem };