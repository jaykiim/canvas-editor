/* ==============================================================================================================================
캔버스 위에 놓일 수 있는 모든 엘리먼트와 관련된 타입을 정의한다
============================================================================================================================== */

// 대부분의 타입의 엘리먼트가 갖고 있는 공통 속성
interface ObjectCommonData {
  readonly id: string; // 엘리먼트 아이디
  readonly type: string; // 엘리먼트 타입
  name: string; // 엘리먼트명
  width: number; // 엘리먼트의 너비
  height: number; // 엘리먼트의 높이
  x: number; // 엘리먼트가 x축으로 패닝된 수치 (px)
  y: number; // 엘리먼트가 y축으로 패닝된 수치 (px)
  parentId: string | null; // 부모 엘리먼트의 아이디
  children: Record<string, ChildrenType> | null; // 자식 엘리먼트
};

// 다른 엘리먼트의 자식 엘리먼트가 될 수 있는 엘리먼트 타입
type ChildrenType = ShapeElement;

// * 페이지 엘리먼트 ----------------------------------------------------------------------------------------------------------------

interface PageElement extends ObjectCommonData  {
  parentId: null;
  scale: number; // 페이지의 확대/축소 수치
};

// * 쉐입 엘리먼트 ----------------------------------------------------------------------------------------------------------------

interface ShapeElement extends ObjectCommonData {
  parentId: string;
  children: Record<string, ChildrenType>;
  properties: DesignProps;
};

interface DesignProps {
  backgroundColor?: string;
  lineColor?: string;
  lineThickness?: number;
}

export type { PageElement, ShapeElement };