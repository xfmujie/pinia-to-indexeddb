/**
 * @description IndexedDB封装
 * @author DeepSeek & 昔枫沐杰
 */

class IndexedDBStorage {
  /**
   * @param {string} dbName 数据库名称
   * @param {string} storeName 存储空间名称
   */
  constructor(dbName, storeName) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
    this.ready = this._initializeDB();
  }

  // 初始化数据库连接并创建存储空间
  _initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // 存储键值对（值会被转换为字符串）
  async setItem(key, value) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const options = {key, value: String(value)};
      if(typeof value === 'object' || typeof value === 'array') {
        options.value = JSON.stringify(value);
      }
      const request = store.put(options);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
      tx.oncomplete = () => {}; // 事务完成
    });
  }

  // 获取键对应的值（不存在则返回 null，如结果字符串符合对象数组格式，则返回反序列化对象或数组）
  async getItem(key) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        // console.log(request.result);
        if(request.result) {
          let value = request.result.value;
          try {
            value = JSON.parse(request.result.value);
          } catch (e) { }
          resolve(value);
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // 删除指定键的数据
  async removeItem(key) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // 清空所有数据
  async clear() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // 获取键的总数
  async length() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

export default IndexedDBStorage;