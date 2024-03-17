/* ==============================================================================================================================
캔버스 위에 놓일 수 있는 모든 엘리먼트와 관련된 타입을 정의한다
============================================================================================================================== */

// * 공통 ----------------------------------------------------------------------------------------------------------------

// 대부분의 타입의 엘리먼트가 갖고 있는 공통 속성
interface ElementCommonData {
  readonly id: string; // 엘리먼트 아이디
  readonly type: string; // 엘리먼트 타입
  name: string; // 엘리먼트명
  width: number; // 엘리먼트의 너비
  height: number; // 엘리먼트의 높이
  x: number; // 엘리먼트가 x축으로 패닝된 수치 (px)
  y: number; // 엘리먼트가 y축으로 패닝된 수치 (px)
  parentId: string | null; // 부모 엘리먼트의 아이디
  children: ElementStore<ChildrenType> | null; // 자식 엘리먼트
};

// 프로젝트 내에 속한 모든 페이지 정보를 저장하는 pinia 스토어 타입 
interface ElementStore<T extends ElementCommonData> {
  list: string[];  // 프로젝트 내에 속한 모든 페이지의 아이디 목록
  detail: Record<string, T>;
}

// 모든 엘리먼트 타입
type ElementType = PageElement | ShapeElement ;

// 다른 엘리먼트의 자식 엘리먼트가 될 수 있는 엘리먼트 타입
type ChildrenType = ShapeElement;

// * 엘리먼트 타입 ----------------------------------------------------------------------------------------------------------------

interface PageElement extends ElementCommonData  {
  readonly default?: boolean;
  parentId: null;
  scale: number; // 페이지의 확대/축소 수치
  type: 'page';
};

interface ShapeElement extends ElementCommonData {
  parentId: string;
  children: ElementStore<ChildrenType>;
  properties: DesignProps;
};

// * 엘리먼트 속성 카테고리 ----------------------------------------------------------------------------------------------------------------

interface DesignProps {
  backgroundColor?: string;
  lineColor?: string;
  lineThickness?: number;
}

export type { ElementStore, ElementType, ChildrenType, PageElement, ShapeElement };