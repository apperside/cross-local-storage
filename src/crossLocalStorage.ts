/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

//Try to load react-native AsyncStorage
let AsyncStorage = undefined;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch (err: any) {
  console.warn("native AsyncStorage not found");
}

console.log("localStorage is", typeof localStorage);
const _localStorage =
  typeof localStorage !== "undefined" ? localStorage : AsyncStorage;

if (!_localStorage) {
  //TODO: how to test this?
  console.error(
    "windows.localstorage and @react-native-async-storage/async-storage are both undefined "
  );
}

export enum LocalStorageKeysEnum {}
// to be augmented

export type LocalStorageKeys = keyof typeof LocalStorageKeysEnum;

type LocalStorageKeyValuePair = { [key in LocalStorageKeys]?: string | null };

let _logginEnabled =
  ["development", "dev", "test"].indexOf(process.env.NODE_ENV as any) >= 0;
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

export const crossLocalStorage = {
  getItem: async (key: LocalStorageKeys) => {
    const value = await _localStorage.getItem(key);
    _logginEnabled && console.log(`value for key ${key} is ${value}`);
    return value;
  },

  setItem: async (key: LocalStorageKeys, data?: string | null) => {
    _logginEnabled && console.log(`trying to insert ${data} for key ${key}`);
    if (data !== undefined && data != null) {
      return await _localStorage.setItem(key, data);
    }
    return crossLocalStorage.removeItem(key);
  },

  removeItem: async (key: LocalStorageKeys): Promise<boolean> => {
    _logginEnabled && console.log("removing key from local storage " + key);
    try {
      return await _localStorage.removeItem(key);
    } catch (err) {
      console.error(`error removing ${key} from local storage`, err);
      throw err;
    }
  },

  setJson: async (key: LocalStorageKeys, data: any) => {
    _logginEnabled && console.log(`trying to insert json for key ${key}`, data);
    if (data !== undefined && data != null) {
      return await _localStorage.setItem(key, JSON.stringify(data));
    }
    return crossLocalStorage.removeItem(key);
  },
  getJson: async <T = any>(key: LocalStorageKeys) => {
    const value = await _localStorage.getItem(key);
    _logginEnabled && console.log(`boolean value for key ${key} is ${value}`);
    if (!!value) {
      return JSON.parse(value) as any as T;
    }
    return null;
  },

  setBoolean: async (key: LocalStorageKeys, data?: boolean | null) => {
    _logginEnabled &&
      console.log(`trying to insert boolean ${data} for key ${key}`);
    let value = data;
    if (value == undefined || value == null) {
      value = false;
    } else if (typeof value !== "boolean") {
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else {
        _logginEnabled &&
          console.log("invalid value passed to setBoolean", data);
        return false;
      }
    }
    return await _localStorage.setItem(key, String(value));
  },

  getBoolean: async (key: LocalStorageKeys) => {
    const value = await _localStorage.getItem(key);
    _logginEnabled && console.log(`boolean value for key ${key} is ${value}`);
    return value == "true";
  },

  setNumber: async (key: LocalStorageKeys, data?: number) => {
    _logginEnabled &&
      console.log(`trying to insert number ${data} for key ${key}`);
    if (data && isNaN(data)) {
      throw new Error("value is not a number");
    }
    if (data !== undefined && data != null) {
      return await _localStorage.setItem(key, String(data));
    }
    //@ts-ignore
    return crossLocalStorage.removeItem(key as any);
  },

  getNumber: async (
    key: LocalStorageKeys,
    defaultValue: number | null = null
  ) => {
    const value = await _localStorage.getItem(key);
    _logginEnabled && console.log(`number value for key ${key} is ${value}`);
    if (value === null) {
      return defaultValue;
    }
    return Number(value);
  },

  multiSet: async (data: LocalStorageKeyValuePair) => {
    // remove all keys with undefined or null values
    const stringifiedItems = Object.entries(data)
      // stringify the values
      .map((entry) => {
        entry[1] = String(entry[1]);
        return entry;
      }) as string[][];
    console.log("stringifiedItems", stringifiedItems);
    // build promises
    const promises = stringifiedItems.map((keyValue: any[]) => {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          const key: any = (keyValue as any)[0] as any;
          const value = (data as any)[key];
          if (value === undefined || value === null) {
            //@ts-ignore
            await crossLocalStorage.removeItem(key);
          } else {
            await _localStorage.setItem(key, (data as any)[key]);
          }
          resolve(true);
        } catch (error) {
          console.error(`error in multiset for key ${keyValue} `, error);
          reject(error);
        }
      });
    });
    try {
      const result = await Promise.all(promises);
      return result.reduce((acc, curr) => {
        return acc && curr;
      }, !!result[0]);
    } catch (err) {
      console.error("********* error in multiset", err);
      throw err;
    }
  },

  multiGet: async (
    ...keys: LocalStorageKeys[]
  ): Promise<LocalStorageKeyValuePair> => {
    const promises = keys.map((key) => {
      return _localStorage.getItem(key);
    });
    const result = await Promise.all(promises);
    console.log("multi get reulst is", result);
    return result.reduce((acc, current, index) => {
      acc[keys[index] as any] = current;
      return acc;
    }, {});
  },

  multiRemove: async (...keys: LocalStorageKeys[]): Promise<boolean> => {
    _logginEnabled &&
      console.log("removing multiple keys from local storage ", keys);
    const promises = keys.map((key) => {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          await _localStorage.removeItem(key);
          resolve(true);
        } catch (error) {
          console.error(`error removing ${key} from local storage`, error);
          reject(error);
        }
      });
    });
    const result = await Promise.all(promises);
    return result.reduce((acc, curr) => {
      return acc && curr;
    }, !!result[0]);
  },

  clear: async () => _localStorage.clear(),

  enableLogging: (enabled: boolean) => {
    _logginEnabled = enabled;
  },
};
export default crossLocalStorage;
