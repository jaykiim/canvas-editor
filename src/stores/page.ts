import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';
import type { ElementStore, PageElement, ElementTypes, DirectoryTypes } from '@/types/Element';

export const usePageStore = defineStore('page', () => {
  const store = reactive<ElementStore<DirectoryTypes>>({
    list: ['1d5c2a17-ebd8-4075-8c94-8081c668fc20', '3f9c5075-7fa7-4f02-83aa-a794bda3bd51', '089ad87q-ifac-10uk-253f-1047dk38dfck'],
    detail: {
      '1d5c2a17-ebd8-4075-8c94-8081c668fc20': {
        isHome: true,
        id: '1d5c2a17-ebd8-4075-8c94-8081c668fc20',
        type: 'page',
        name: 'Home',
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        scale: 1,
        parentId: '',
        children: {
          list: ['416ce213-d8ac-4b71-9269-48b80729d028', 'e7a7666e-49a7-4212-9941-4398a7c16a2c'],
          detail: {
            '416ce213-d8ac-4b71-9269-48b80729d028': {
              id: '416ce213-d8ac-4b71-9269-48b80729d028',
              type: 'shape',
              name: 'shape1',
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
              name: 'shape2',
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
      '3f9c5075-7fa7-4f02-83aa-a794bda3bd51': {
        id: '3f9c5075-7fa7-4f02-83aa-a794bda3bd51',
        type: 'page',
        name: 'test2',
        width: 1200,
        height: 860,
        x: 50,
        y: 120,
        scale: 1.5,
        parentId: '',
        children: {
          list: ['53be25bf-eb5c-4e36-9364-c0271b921a4b'],
          detail: {
            '53be25bf-eb5c-4e36-9364-c0271b921a4b': {
              id: '53be25bf-eb5c-4e36-9364-c0271b921a4b',
              type: 'shape',
              name: 'shape3',
              width: 100,
              height: 150,
              x: 600,
              y: 400,
              parentId: '3f9c5075-7fa7-4f02-83aa-a794bda3bd51',
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
      },
      '089ad87q-ifac-10uk-253f-1047dk38dfck': {
        id: '089ad87q-ifac-10uk-253f-1047dk38dfck',
        type: 'folder',
        name: 'folder',
        parentId: '',
        children: {
          list: ['56f4e3e8-309d-4d38-bc34-d1096e7aa0b4'],
          detail: {
            '56f4e3e8-309d-4d38-bc34-d1096e7aa0b4': {
              id: '56f4e3e8-309d-4d38-bc34-d1096e7aa0b4',
              type: 'page',
              name: 'testtest',
              parentId: '089ad87q-ifac-10uk-253f-1047dk38dfck',
              x: 0,
              y: 0,
              width: 1920,
              height: 1080,
              scale: 1,
              children: { list: [], detail: {} }
            }
          }
        }
      }
    }
  });

  /* ====================================================================================================================================================================================
  공통
  ==================================================================================================================================================================================== */

  function findElementById(id: string, range: ElementStore<ElementTypes>) {
    const search = (currentLevel: ElementStore<ElementTypes>) => {
      const result = currentLevel.list.find(id_ => id_ === id);
      if (result) {
        return { target: currentLevel.detail[result], parent: currentLevel };
      } else {
        currentLevel.list.forEach(id_ => {
          const children = currentLevel.detail[id_].children;
          if (children) {
            search(children);
          }
        })
      }
    }
    return search(range);
  }

  function findElementByName(name: string, range: ElementStore<ElementTypes>) {
    const result: ElementTypes[] = [];
    const search = (currentLevel: ElementStore<ElementTypes>) => {
      currentLevel.list.forEach(id_ => {
        const item = currentLevel.detail[id_];
        if (item.name.toLowerCase().includes(name.toLowerCase())) {
          result.push(item);
        } else {
          search(item.children);
        }
      })
    }
    search(range);
    return result;
  }

  // 중첩된 모든 자손 엘리먼트의 uuid를 새로 교체하는 함수
  function changeDecendantIds(id: string, container: ElementStore<ElementTypes>) {
    const original = container.detail[id];
    const newChildren: ElementStore<ElementTypes> = { list: [], detail: {} };
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
    newChildren.list.forEach(id_ => changeDecendantIds(id_, newChildren));
  }

  function addElement(element: ElementTypes, parent: ElementStore<ElementTypes>) {
    parent.list.push(element.id);
    parent.detail[element.id] = element;
  }

  function deleteElement(id: string, range: ElementStore<ElementTypes>) {
    const result = findElementById(id, range);
    if (result) {
      const { target, parent } = result;
      if (target.type === 'page') {
        if ((target as PageElement).isHome) return;
      }

      parent.list = parent.list.filter(id_ => id_ !== id);
      delete parent.detail[id];

      if (target.type === 'page' || target.type === 'folder') {
        // todo 타겟에서 가장 가까운 페이지 선택
      }
    }
  }

  function cloneElement(element: ElementTypes, parent: ElementStore<ElementTypes>) {
    const newId = uuidv4();
    const newVal: ElementTypes = JSON.parse(JSON.stringify(element));

    newVal.id = newId;
    parent.list.push(newId);
    parent.detail[newId] = newVal;
    changeDecendantIds(newId, parent);

    if (element.type === 'page') {
      selectedPage.value = newId;
    }

    return newVal;
  }

  /* ====================================================================================================================================================================================
  Page
  ==================================================================================================================================================================================== */

  const selectedPage = ref(store.list[0]); // selected from LNB

  function setPageAsHome(id: string) {
    // 기존 홈페이지명 변경 
    const prevHome = Object.values(store.detail).find(page => {
      if (page.type === 'page') {
        return (page as PageElement).isHome === true;
      }
    }) as PageElement;

    if (prevHome) {
      prevHome.isHome = false;
      prevHome.name = 'old-home';
    }
    
    // 새 홈페이지명 변경
    const newHome = store.detail[id];
    if (newHome.type === 'page') {
      (newHome as PageElement).isHome = true;
      newHome.name = 'Home';
    }

    // 순서 변경
    const reorderedList = store.list.filter(id_ => id_ !== id);
    reorderedList.unshift(id);
    store.list = reorderedList;
  }

  /* ====================================================================================================================================================================================
  Graphic Element
  ==================================================================================================================================================================================== */

  const selectedElement = reactive<ElementTypes[]>([]); // selected from Canvas

  return { store, selectedPage, selectedElement, setPageAsHome, findElementById, findElementByName, addElement, deleteElement, cloneElement };
});
