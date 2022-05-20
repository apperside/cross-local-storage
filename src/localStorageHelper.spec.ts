/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import cls from "./localStorageHelper"

declare module "./localStorageHelper" {
	/**
  
	  * Augment this interface to add al custom endpoints
  
	  */

	export interface LocalStorageKeys {
		myLocalStorageKey: string;
		anotherLocalStorageKey: string;
		booleanKey: string;
		numberKey: string;
		jsonKey: string;
	}
}

describe("crossplatform local storage", () => {

	beforeEach(async () => {
		await cls.clear();
	})
	test("simple get and set", async () => {

		let value1 = await cls.getItem("myLocalStorageKey");
		expect(value1).toBeNull()

		await cls.setItem("myLocalStorageKey", "myValue");
		value1 = await cls.getItem("myLocalStorageKey");
		expect(value1).toBe("myValue")

		let value2 = await cls.getItem("anotherLocalStorageKey");
		expect(value2).toBeNull()
		await cls.setItem("anotherLocalStorageKey", "anothervalue");
		value2 = await cls.getItem("anotherLocalStorageKey");
		expect(value2).toBe("anothervalue")

		await cls.setItem("myLocalStorageKey", null);
		value1 = await cls.getItem("myLocalStorageKey");
		expect(value1).toBeNull()

	});

	test("multi set/get/remove", async () => {

		await cls.multiSet({
			myLocalStorageKey: "value1",
			anotherLocalStorageKey: "value2",
		});

		const item = await cls.getItem("myLocalStorageKey");
		expect(item).toBe("value1")

		const multivalue = await cls.multiGet(
			"myLocalStorageKey",
			"anotherLocalStorageKey"
		);

		expect(multivalue).toEqual({
			myLocalStorageKey: "value1",
			anotherLocalStorageKey: "value2"
		})

		//set values an assert the values are set
		const setAndExpectValue = async () => {
			await cls.multiSet({
				myLocalStorageKey: "value1",
				anotherLocalStorageKey: "value2",
			})

			const multivalue = await cls.multiGet(
				"myLocalStorageKey",
				"anotherLocalStorageKey"
			);

			expect(multivalue).toEqual({
				myLocalStorageKey: "value1",
				anotherLocalStorageKey: "value2"
			})
		}

		// check that values are cleared
		const expectNullValues = async () => {
			const multivalue = await cls.multiGet(
				"myLocalStorageKey",
				"anotherLocalStorageKey"
			);
			expect(multivalue).toEqual({
				myLocalStorageKey: null,
				anotherLocalStorageKey: null
			})
		}

		await setAndExpectValue();

		await cls.multiRemove("myLocalStorageKey", "anotherLocalStorageKey");

		await expectNullValues()

		await setAndExpectValue();

		await cls.multiSet({
			myLocalStorageKey: null,
			anotherLocalStorageKey: null
		});

		await expectNullValues()

	});

	test("set/get json", async () => {

		type MyJson = {
			field1: string,
			field2: number,
		};

		const myJson: MyJson = {
			field1: "value1",
			field2: 2,
		}

		await cls.setJson("jsonKey", myJson);
		let value = await cls.getJson("jsonKey");
		expect(value).toEqual(myJson);

		await cls.setJson("jsonKey", null);
		value = await cls.getJson("jsonKey");
		expect(value).toBeNull()

	});

	test("get/set boolean", async () => {
		let booleanValue = await cls.getBoolean("booleanKey");
		expect(booleanValue).toBe(false)
		await cls.setBoolean("booleanKey", true);
		booleanValue = await cls.getBoolean("booleanKey");
		expect(booleanValue).toBe(true)

		await cls.setBoolean("booleanKey", null);
		booleanValue = await cls.getBoolean("booleanKey");
		expect(booleanValue).toBe(false)

		await cls.setBoolean("booleanKey", "true" as any);
		booleanValue = await cls.getBoolean("booleanKey");
		expect(booleanValue).toBe(true)

		await cls.setBoolean("booleanKey", "false" as any);
		booleanValue = await cls.getBoolean("booleanKey");
		expect(booleanValue).toBe(false)

		const result = await cls.setBoolean("booleanKey", "fake-value" as any);
		expect(result).toBe(false)
	});

	test("get/set number", async () => {
		let numberValue = await cls.getNumber("numberKey");
		expect(numberValue).toBeNull()
		numberValue = await cls.getNumber("numberKey", 6);
		expect(numberValue).toBe(6)
		await cls.setNumber("numberKey", 1);
		numberValue = await cls.getNumber("numberKey");
		expect(numberValue).toBe(1)
	});
});

