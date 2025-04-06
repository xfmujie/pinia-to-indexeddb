/**
 * @description
 * - 功能描述:
 *   将pinia中的state存入IndexedDB
 * 
 * - 使用方法:
 *   参考src/main.js
 * 
 * @author 昔枫沐杰
 * @Date 2025-03-09
 */

import IndexedDBStorage from '@/Indexeddb'

class PiniaToDB {
  /**
   * @param {*} store pinia的store实例
   * @param {string} dbName IndexedDB的数据库名称
   * @param {string} storeName IndexedDB的存储空间名称
   */
  constructor(store, dbName, storeName) {
    this.store = store;
    this.stateArr = [];
    this.db = new IndexedDBStorage(dbName, storeName);
  }

  async hydrate() {
    for(let key in this.store.$state) {
      const val = await this.db.getItem(key);
      if (val) {
        this.store.$state[key] = val;
      }
    }
    console.log('从Indexed加载数据: ', JSON.parse(JSON.stringify(this.store.$state)));
  }

  /**
   * @description 订阅store中的state变化，变化后存入IndexedDB
   * @param {string[]} stateArr 订阅的state数组，不传或空数组则订阅全部
   */
  async subscribe(stateArr = []) {
    // 订阅前先从IndexedDB加载数据，避免数据冲突
    await this.hydrate();
    this.stateArr = stateArr;
    this.unSubscribe = this.store.$subscribe((mutation, state) => {
      if (stateArr.length == 0) {
        for (let key in state) {
          this.db.setItem(key, state[key]);
        }
      } else {
        this.stateArr.forEach(item => {
          this.db.setItem(item, state[item]);
        });
      }
    });
  }
}

export default PiniaToDB;