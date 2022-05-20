import { useCallback, useEffect } from "react";
import cls from "cross-local-storage";

import "./App.css";
import logo from "./logo.svg";

declare module "cross-local-storage" {
  /**

	* Augment this interface to add al custom endpoints

	*/

  export interface LocalStorageKeys {
    myLocalStorageKey: string;
    anotherLocalStorageKey: string;
    booleanKey: string;
    numberKey: string;
  }
}

function App() {
  useEffect(() => {
    const test = async () => {
      try {
        await cls.clear();
        let result = await cls.getItem("myLocalStorageKey");
        if (!!result) {
          throw new Error("mykey exists even though it should not");
        }
        await cls.setItem("myLocalStorageKey", "myvalue");
        result = await cls.getItem("myLocalStorageKey");
        if (result !== "myvalue") {
          throw new Error("mykey is not myvalue");
        }
        await cls.setItem("anotherLocalStorageKey", "anothervalue");
        const data = await cls.multiGet(
          "myLocalStorageKey",
          "anotherLocalStorageKey"
        );
        if (data.anotherLocalStorageKey !== "anothervalue") {
          throw new Error("anotherkey is not anothervalue");
        }
        if (data.myLocalStorageKey !== "myvalue") {
          throw new Error("mykey is not myvalue");
        }

        let booleanValue = await cls.getBoolean("booleanKey");
        if (!!booleanValue) {
          throw new Error("booleanKey is not false even though it should be");
        }
        await cls.setBoolean("booleanKey", true);
        booleanValue = await cls.getBoolean("booleanKey");
        if (booleanValue !== true) {
          throw new Error("booleanKey is not true even though it should be");
        }

        let numberValue = await cls.getNumber("numberKey");
        if (!!numberValue) {
          throw new Error("numberKey is not false even though it should be");
        }
        await cls.setNumber("numberKey", 6);
        numberValue = await cls.getNumber("numberKey");
        if (numberValue !== 6) {
          throw new Error("numberKey is not 6 even though it should be");
        }
        alert("success");
      } catch (err) {
        alert("err");
      }
    };
    test();
  });

  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;

