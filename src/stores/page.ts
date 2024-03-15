import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';
import type { ElementStore, PageElement } from '@/types/Element';

export const useElementStore = defineStore('page', () => {
  const elementStore = reactive<ElementStore>({
    list: ['1d5c2a17-ebd8-4075-8c94-8081c668fc20', '6d975107-3ffb-422f-8b2d-83a95361738d'],
    detail: {
      '1d5c2a17-ebd8-4075-8c94-8081c668fc20': {
        id: '1d5c2a17-ebd8-4075-8c94-8081c668fc20',
        type: 'page',
        name: 'test1',
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        scale: 1,
        parentId: null,
        children: {
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
            children: {}
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
            children: {}
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
            children: {}
          }
        }
      }
    }
  });

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
      children: {}
    };

    elementStore.list.push(id);
    elementStore.detail[id] = page;
  }
  return { elementStore, addPage };
});
