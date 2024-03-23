/* ==============================================================================================================================
디렉토리 요소와 그래픽 요소에 대한 타입을 정의한다
============================================================================================================================== */

// * 공통 ---------------------------------------------------------------------------------------------------------------------

// 모든 엘리먼트 타입
type ElementTypes = DirectoryTypes | GraphicTypes ;

// 공통 속성
interface ElementCommonProps {
  id: string; // 엘리먼트 아이디
  type: string; // 엘리먼트 타입
  name: string; // 엘리먼트명
  parentId: string;
};

interface ElementStore<T extends ElementTypes> {
  list: string[];  // 프로젝트 내에 속한 모든 페이지의 아이디 목록
  detail: Record<string, T>;
}

// * 디렉토리 요소 ----------------------------------------------------------------------------------------------------------------

type DirectoryTypes = FolderElement | PageElement;

interface DirectoryElementProps extends ElementCommonProps {
}

interface FolderElement extends DirectoryElementProps {
  type: 'folder';
  children: ElementStore<DirectoryTypes>;
}

interface PageElement extends DirectoryElementProps, GraphicElementProps  {
  type: 'page';
  isHome?: boolean;
  scale: number; // 페이지의 확대/축소 수치
  children: ElementStore<ElementTypes>; // 폴더, 그래픽 요소, 페이지 모두 페이지의 자식이 될 수 있다
};

// * 그래픽 요소 ----------------------------------------------------------------------------------------------------------------

type GraphicTypes = ShapeElement;

interface GraphicElementProps extends ElementCommonProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ShapeElement extends GraphicElementProps {
  parentId: string;
  children: ElementStore<GraphicTypes>;
  properties: DesignProps;
};

// * 디자인 속성 ----------------------------------------------------------------------------------------------------------------

interface DesignProps {
  backgroundColor?: string;
  lineColor?: string;
  lineThickness?: number;
}

export type { ElementStore, ElementTypes, DirectoryTypes, FolderElement, PageElement, ShapeElement, GraphicTypes};