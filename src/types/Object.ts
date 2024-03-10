/* ==============================================================================================================================
캔버스 위에 놓일 수 있는 모든 오브젝트와 관련된 타입을 정의한다
============================================================================================================================== */

// 대부분의 타입의 오브젝트가 갖고 있는 공통 속성
interface ObjectCommonData {
  readonly id: string; // 오브젝트 아이디
  readonly type: string; // 오브젝트 타입
  name: string; // 오브젝트명
  width: number; // 오브젝트의 너비
  height: number; // 오브젝트의 높이
  x: number; // 오브젝트가 x축으로 패닝된 수치 (px)
  y: number; // 오브젝트가 y축으로 패닝된 수치 (px)
  parentId: string | null; // 부모 오브젝트의 아이디
  children: Record<string, ChildrenType> | null; // 자식 오브젝트
};

// 다른 오브젝트의 자식 오브젝트가 될 수 있는 오브젝트 타입
type ChildrenType = DesignObject;

// * 페이지 오브젝트 ----------------------------------------------------------------------------------------------------------------

interface PageObject extends ObjectCommonData  {
  parentId: null;
  scale: number; // 페이지의 확대/축소 수치
};

// * 디자인 오브젝트 ----------------------------------------------------------------------------------------------------------------

interface DesignObject extends ObjectCommonData {
  parentId: string;
  children: Record<string, ChildrenType>;
  properties: DesignProps;
};

interface DesignProps {
  backgroundColor?: string;
  lineColor?: string;
  lineThickness?: number;
}