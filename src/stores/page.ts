import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';
import type { ElementStore, PageElement, ElementType, ChildrenType } from '@/types/Element';

export const useElementStore = defineStore('element', () => {
  const store = reactive<ElementStore<PageElement>>({
    list: ['1d5c2a17-ebd8-4075-8c94-8081c668fc20', '6d975107-3ffb-422f-8b2d-83a95361738d'],
    detail: {
      '1d5c2a17-ebd8-4075-8c94-8081c668fc20': {
        default: true,
        id: '1d5c2a17-ebd8-4075-8c94-8081c668fc20',
        type: 'page',
        name: 'Home',
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        scale: 1,
        parentId: null,
        children: {
          list: ['416ce213-d8ac-4b71-9269-48b80729d028', 'e7a7666e-49a7-4212-9941-4398a7c16a2c'],
          detail: {
            '416ce213-d8ac-4b71-9269-48b80729d028': {
              id: '416ce213-d8ac-4b71-9269-48b80729d028',
              type: 'shape',
              name: 'object1',
              width: 100,
              height: 150,
              x: 100,
              y: 200,
              parentId: '1d5c2a17-ebd8-4075-8c94-8081c668fc20',
              properties: {
                backgroundColor: '#bbb',
              },
              children: {
                list: [],
                detail: {}
              }
            },
            'e7a7666e-49a7-4212-9941-4398a7c16a2c': {
              id: 'e7a7666e-49a7-4212-9941-4398a7c16a2c',
              type: 'shape',
              name: 'object1',
              width: 100,
              height: 150,
              x: 100,
              y: 200,
              parentId: '1d5c2a17-ebd8-4075-8c94-8081c668fc20',
              properties: {
                lineColor: '#bbb',
                lineThickness: 2,
              },
              children: {
                list: [],
                detail: {}
              }
            }
          }
        }
      },
      '6d975107-3ffb-422f-8b2d-83a95361738d': {
        id: '6d975107-3ffb-422f-8b2d-83a95361738d',
        type: 'page',
        name: 'test2',
        width: 1200,
        height: 860,
        x: 50,
        y: 120,
        scale: 1.5,
        parentId: null,
        children: {
          list: ['53be25bf-eb5c-4e36-9364-c0271b921a4b'],
          detail: {
            '53be25bf-eb5c-4e36-9364-c0271b921a4b': {
              id: '53be25bf-eb5c-4e36-9364-c0271b921a4b',
              type: 'shape',
              name: 'testObj1',
              width: 100,
              height: 150,
              x: 600,
              y: 400,
              parentId: '6d975107-3ffb-422f-8b2d-83a95361738d',
              properties: {
                backgroundColor: '#bbb',
              },
              children: {
                list: [],
                detail: {}
              }
            }
          }
        }
      }
    }
  });

  const selectedPage = ref(store.list[0]); // selected from LNB
  const selectedElement = reactive<ElementType[]>([]); // selected from Canvas

  function addPage() {
    const id = uuidv4();
    const page: PageElement = {
      id: id,
      parentId: null,
      type: 'page',
      name: 'page',
      width: 1980,
      height: 1020,
      x: 0,
      y: 0,
      scale: 1,
      children: { list: [], detail: {} }
    };

    store.list.push(id);
    store.detail[id] = page;
  }

  function deletePage(id: string) {
    const target = store.detail[id];
    if (target?.default === true) {
      return;
    } else {
      // 타겟 삭제
      store.list = store.list.filter(pageId => pageId !== id);
      delete store.detail[id];

      // 타겟 -1번째 페이지 선택 
      const targetIdx = store.list.findIndex((id_) => id_ === id);
      selectedPage.value = store.list[targetIdx - 1];
    }
  }

  function findPageByName(name: string) {
    const pageList = Object.values(store.detail);
    return pageList.filter(page => {
      return page.name.toLowerCase().includes(name.toLowerCase());
    });
  }

  function clonePage(topNodeId: string) {
    const topNode = store.detail[topNodeId]; // 복제할 원본 페이지
    const newId = uuidv4(); // 새 아이디 
    const newVal: PageElement = JSON.parse(JSON.stringify(topNode)); // 연결성을 끊은 새 객체

    newVal.id = newId; // 새 객체의 id값 교체
    store.list.push(newId); // 새 아이디를 페이지 리스트에 추가 
    store.detail[newId] = newVal; // 새 객체 등록
    deepChangeUuid(newId, store); // 새 객체의 모든 자손의 uuid 교체

    selectedPage.value = newId;
  }

  function setPageAsHome(id: string) {
    // 기존 홈페이지명 변경 
    const prevHome = Object.values(store.detail).find(page => page.default === true);
    if (prevHome) {
      prevHome.default = false;
      prevHome.name = 'old-home';
    }
    
    // 새 홈페이지명 변경
    const newHome = store.detail[id];
    if (newHome) {
      newHome.default = true;
      newHome.name = 'Home';
    }

    // 순서 변경
    const reorderedList = store.list.filter(id_ => id_ !== id);
    reorderedList.unshift(id);
    store.list = reorderedList;
  }

  // 중첩된 모든 자손 엘리먼트의 uuid를 새로 교체하는 함수
  function deepChangeUuid(id: string, container: ElementStore<ElementType>) {
    const original = container.detail[id];
    const newChildren: ElementStore<ChildrenType> = { list: [], detail: {} };
    if (original.children?.list?.length) {
      Object.values(original.children.detail).forEach(child => {
        const newId = uuidv4();
        const newVal = JSON.parse(JSON.stringify(child));
        newVal.id = newId;
        newVal.parentId = original.id;
        newChildren.list.push(newId);
        newChildren.detail[newId] = newVal;
      });
    }
    original.children = newChildren;
    newChildren.list.forEach(id_ => deepChangeUuid(id_, newChildren));
  }

  return { store, selectedPage, selectedElement, addPage, deletePage, findPageByName, clonePage, setPageAsHome };
});
