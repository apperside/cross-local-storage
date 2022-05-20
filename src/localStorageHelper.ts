/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

//Try to load react-native AsyncStorage
let AsyncStorage = undefined;
try {
	AsyncStorage = require('@react-native-community/async-storage').default;
} catch (err: any) {
	console.warn('AsyncStorage not found');
}
const _localStorage =
	typeof localStorage !== 'undefined' ? localStorage : AsyncStorage;

if (!_localStorage) {
	console.error("windows.localstorage and @react-native-community/async-storage are both undefined ");
}

export interface ILocalStorage {
	setItem: (key: keyof LocalStorageKeys, data?: string | null) => void | Promise<any>;
	getItem: (key: keyof LocalStorageKeys) => Promise<string | null>;
	removeItem: (key: keyof LocalStorageKeys) => Promise<boolean>;
	setBoolean: (
		key: keyof LocalStorageKeys,
		data?: boolean | null,
	) => Promise<boolean | void>;
	getBoolean: (key: keyof LocalStorageKeys) => Promise<boolean>;
	setJson: (
		key: keyof LocalStorageKeys,
		data: any,
	) => Promise<boolean | void>;
	getJson: <T = any>(key: keyof LocalStorageKeys) => Promise<T | null>;
	setNumber: (
		key: keyof LocalStorageKeys,
		data: number,
	) => Promise<boolean | void>;
	getNumber: (key: keyof LocalStorageKeys, defaultValue?: number | null) => Promise<number | null>;
	multiSet: (data: LocalStorageKeyValuePair) => Promise<boolean>;
	multiGet: (
		...keys: (keyof LocalStorageKeys)[]
	) => Promise<LocalStorageKeyValuePair>;
	multiRemove: (...keys: (keyof LocalStorageKeys)[]) => Promise<boolean>;
	clear: () => void;
	enableLogging: (enabled: boolean) => void;
}


export interface LocalStorageKeys {
	// to be augmented
}

type LocalStorageKeyValuePair = { [key in keyof Partial<LocalStorageKeys>]?: string | null };

let _logginEnabled = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev';


export const crossLocalStorage: ILocalStorage = {

	getItem: async (key: keyof LocalStorageKeys) => {
		const value = await _localStorage.getItem(key);
		_logginEnabled && console.warn(`value for key ${key} is ${value}`);
		return value;
	},
	setItem: async (key: keyof LocalStorageKeys, data?: string | null) => {
		_logginEnabled && console.warn(`trying to insert ${data} for key ${key}`);
		if (data !== undefined && data != null) {
			return await _localStorage.setItem(key, data);
		}
		return crossLocalStorage.removeItem(key);
	},
	// remove items is used from other function
	removeItem: async (key: keyof LocalStorageKeys): Promise<boolean> => {
		_logginEnabled && console.warn('removing key from local storage ' + key);
		try {
			return await _localStorage.removeItem(key);
		} catch (err) {
			console.error(`error removing ${key} from local storage`, err);
			return false
		}
	},

	setJson: async (key: keyof LocalStorageKeys, data: any) => {
		_logginEnabled && console.warn(`trying to insert json for key ${key}`, data);
		if (data !== undefined && data != null) {
			return await _localStorage.setItem(key, JSON.stringify(data));
		}
		return crossLocalStorage.removeItem(key);
	},
	getJson: async <T = any>(key: keyof LocalStorageKeys) => {
		const value = await _localStorage.getItem(key);
		_logginEnabled && console.warn(`boolean value for key ${key} is ${value}`);
		if (!!value) {
			return JSON.parse(value) as any as T
		}
		return null;
	},

	setBoolean: async (key: keyof LocalStorageKeys, data?: boolean | null) => {
		_logginEnabled && console.warn(`trying to insert boolean ${data} for key ${key}`);
		let value = data;
		if (value == undefined || value == null) {
			value = false
		}
		else if (typeof value !== 'boolean') {
			if (value === 'true') {
				value = true;
			}
			else if (value === 'false') {
				value = false
			}
			else {
				_logginEnabled && console.log("invalid value passed to setBoolean", data);
				return false;
			}
		}
		return await _localStorage.setItem(key, String(value));
	},

	getBoolean: async (key: keyof LocalStorageKeys) => {
		const value = await _localStorage.getItem(key);
		_logginEnabled && console.warn(`boolean value for key ${key} is ${value}`);
		return value == 'true';
	},

	setNumber: async (key: keyof LocalStorageKeys, data: number) => {
		_logginEnabled && console.warn(`trying to insert number ${data} for key ${key}`);
		if (isNaN(data)) {
			throw new Error("value is not a number")
		}
		if (data !== undefined && data != null) {
			return await _localStorage.setItem(key, String(data));
		}
		return crossLocalStorage.removeItem(key as any);
	},

	getNumber: async (key: keyof LocalStorageKeys, defaultValue: number | null = null) => {
		const value = await _localStorage.getItem(key)
		_logginEnabled && console.warn(`number value for key ${key} is ${value}`);
		if (value === null) {
			return defaultValue
		}
		return Number(value);
	},

	multiSet: async (data: LocalStorageKeyValuePair) => {
		// remove all keys with undefined or null values
		const stringifiedItems = Object.entries(data)
			// stringify the values
			.map(entry => {
				entry[1] = String(entry[1]);
				return entry;
			}) as string[][];
		console.log("stringifiedItems", stringifiedItems)
		// build promises
		const promises = stringifiedItems.map((keyValue: any[]) => {
			return new Promise<boolean>(async (resolve, reject) => {
				try {
					const key: any = (keyValue as any)[0] as any;
					const value = (data as any)[key];
					if (value === undefined || value === null) {
						await crossLocalStorage.removeItem(key);
					}
					else {
						await _localStorage.setItem(key, (data as any)[key]);
					}
					resolve(true)
				} catch (error) {
					console.error(`error removing ${keyValue} from local storage`, error);
					reject(false);
				}

			})
		});
		const result = await Promise.all(promises);
		return result.reduce((acc, curr) => {
			return acc && curr;
		}, !!result[0])
	},

	multiGet: async (
		...keys: (keyof LocalStorageKeys)[]
	): Promise<LocalStorageKeyValuePair> => {
		const promises = keys.map(key => {
			return _localStorage.getItem(key);
		});
		const result = await Promise.all(promises);
		console.log("multi get reulst is", result)
		return result.reduce((acc, current, index) => {
			acc[keys[index] as any] = current;
			return acc;
		}, {})
	},

	multiRemove: async (...keys: (keyof LocalStorageKeys)[]): Promise<boolean> => {
		_logginEnabled && console.warn('removing multiple keys from local storage ', keys);
		const promises = keys.map(key => {
			return new Promise<boolean>(async (resolve, reject) => {
				try {
					await _localStorage.removeItem(key);
					resolve(true)
				} catch (error) {
					console.error(`error removing ${key} from local storage`, error);
					reject(false);
				}

			})
		});
		const result = await Promise.all(promises);
		return result.reduce((acc, curr) => {
			return acc && curr;
		}, !!result[0])
	},

	clear: async () => _localStorage.clear(),

	enableLogging: (enabled: boolean) => {
		_logginEnabled = enabled;
	}
};
export default crossLocalStorage;