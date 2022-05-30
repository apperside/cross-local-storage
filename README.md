

  
  
  
  
  

  

<div id="top"></div>

  
![GitHub branch checks state](https://img.shields.io/github/checks-status/apperside/cross-local-storage/master)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/apperside/cross-local-storage/Node.js%20CI)
[![codecov](https://codecov.io/gh/apperside/cross-local-storage/branch/master/graph/badge.svg?token=KMP3WCEP04)](https://codecov.io/gh/apperside/cross-local-storage)
  

[![Stargazers][stars-shield]][stars-url]
  

[![Issues][issues-shield]][issues-url]

  

[![MIT License][license-shield]][license-url]

  

[![LinkedIn][linkedin-shield]][linkedin-url]

  

  

<!-- PROJECT LOGO -->

  

<br  />

  

<div align="center">

  

<a href="https://github.com/apperside/cross-local-storage">

  

<img width="349" alt="Screenshot_2022-05-20_at_13 12 27-removebg-preview" src="https://user-images.githubusercontent.com/5955338/169516334-06b4fff8-a178-41ab-9d31-4921b5638d05.png">

  

</a>

  

  

<h3 align="center">Cross Local Storage</h3>

  

  

<p align="center">
A small, typescript first, well tested, cross platform wrapper around react-native-async-storage/async-storage which works out of the box on both the browser and react native

Bootstrapped with https://www.npmjs.com/package/react-component-lib-boilerplate

  

<br  />

  

<!--<a href="https://github.com/apperside/cross-local-storage"><strong>Explore the docs »</strong></a>-->

  

<br  />

  

<br  />

  

<!--<a href="https://github.com/apperside/cross-local-storage">View Demo</a>-->

  

·

  

<a href="https://github.com/apperside/cross-local-storage/issues">Report Bug</a>

  

·

  

<a href="https://github.com/apperside/cross-local-storage/issues">Request Feature</a>

  

</p>

  

</div>

  

  

<!-- TABLE OF CONTENTS

  

<details>

  

<summary>Table of Contents</summary>

  

<ol>

  

<li>

  

<a href="#about-the-project">About The Project</a>

  

<ul>

  

<li><a href="#built-with">Built With</a></li>

  

</ul>

  

</li>

  

<li>

  

<a href="#getting-started">Getting Started</a>

  

<ul>

  

<li><a href="#prerequisites">Prerequisites</a></li>

  

<li><a href="#installation">Installation</a></li>

  

</ul>

  

</li>

  

<li><a href="#usage">Usage</a></li>

  

<li><a href="#roadmap">Roadmap</a></li>

  

<li><a href="#contributing">Contributing</a></li>

  

<li><a href="#license">License</a></li>

  

<li><a href="#contact">Contact</a></li>

  

<li><a href="#acknowledgments">Acknowledgments</a></li>

  

</ol>

  

</details>

  

-->

  

<!-- ABOUT THE PROJECT -->

  

## About The Project

  

  

This library was built while I was working on a project based on  react-native-web, where the goal was to maximize the code sharing between the web and native codebase.  
Many pieces of shared business logic (thunks, sagas or whatever) at some time needed to persist something (eg: save token after login).  
This library creates an unique interface that can be used to interact with the localStorage regardless that that your app is running in a browser or with react-native.
Moreover, thanks to typescript augmentation, cross-local-storage expose an augmentable interface to allow you to define the keys of your local storage so it will be much easier to remember the keys used to read and write data
  

<!-- GETTING STARTED -->

  

## Getting Started

  

Install the library from npm registry

  

  

### Installation

  

  

This is an example of how to list things you need to use the software and how to install them.

  

* npm

  

```sh
npm i apperside/cross-local-storage
```
  

* yarn

  

```sh
yarn add apperside/cross-local-storage
```
##### REACT NATIVE USERS
If you use this library on the web, you are good to go. If you are running on react-native instead, you need to install '@react-native-community/async-storage', here you can find the [full docs](https://react-native-async-storage.github.io/async-storage/docs)
  
  

  

<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- USAGE EXAMPLES -->

  

## Usage

This library is basically a cross-platform implementation of the following interface

```typescript
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

```

  

`LocalStorageKeys` is a type alias which represents the keys of the enum `LocalStorageKeysEnum` , which you can augment to provide the allowed keys for read and write operations (you can find more about typescript's declaration merging feature in [the dedicated documentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)). 

Here is how it is defined

```typescript
export enum LocalStorageKeysEnum {
	// TO BE AUGMENTED
}

export type LocalStorageKeys = keyof  typeof LocalStorageKeysEnum;

```

  This is an example of how you can extend the enum
  <a name="key-declarations"/>

```typescript

/**
* You have to add this declaration wherever you want to augment librariy's types
*/

declare  module  "cross-local-storage" {
	/**
	* Augment this interface to add al custom endpoints
	*/

	export enum LocalStorageKeysEnum {
		myLocalStorageKey,
		anotherLocalStorageKey
	}
}

```


After you augment the interface, you can use the library very easily
```typescript
// since it is the default export, you can rename crossLocalStorage with whatever you want
import crossLocalStorage from "cross-local-storage"

// with async/await
const value = await crossLocalStorage.getItem("myLocalStorageKey")

// with promises
crossLocalStorage.getItem("myLocalStorageKey")
.then(value=>{
	alert("result is "+value);
})

await crollLocalStorage.setItem("myLocalStorageKey" , "my value");

// returns a key-value pair
await crollLocalStorage.multiGet("myLocalStorageKey" , "my value");


```

> **IMPORTANT** Since react-native's AsyncStorage api are async, you need an async approach on web too.
> 
## FULL API

  

  
| method | description |
|--|--|
| **setItem** | it takes in input one of the keys [you have defined](#key-declarations) and the value you want to set. The value can be anything, it will be stringified. If you pass null or undefined, the value will be removed |
| **getItem** | it takes in input one of the keys [you have defined](#key-declarations) and returns the value or null if it does not exist|
| **removeItem** | it takes in input one of the keys [you have defined](#key-declarations) and removes that value. It returns a boolean indicating if the operation succeeded or not. |
| **setBoolean** | utility method to save a boolean value. It takes in input one of the keys [you have defined](#key-declarations) and the value you want to set. The value must be a boolean otherwise you get a typescript error (if you are using it). If you pass a string different from "true", it will fail (don't save anything). If you pass null or undefined false will be set|
| **getBoolean** | utility method to retrieve a boolean value. It takes in input one of the keys [you have defined](#key-declarations) and returns the value as a boolean|
| **setNumber** | utility method to save a number value. It takes in input one of the keys [you have defined](#key-declarations) and the value you want to set. The value must be a valid number otherwise an exception will be thrown. You can also pass null or undefined to remove that key|
| **getNumber** | utility method to retrieve a number value. It takes in input one of the keys [you have defined](#key-declarations) and an optional default value to return in case the key is not found (returns null by default)|
| **setJson** | utility method to save a stringified json value. It takes in input one of the keys [you have defined](#key-declarations) and the value you want to set. The value can be anything, it will be saved as JSON.stringify(value)|
| **getJson** | utility method to retrieve a parsed json value. It takes in input one of the keys [you have defined](#key-declarations) and returns the value parsed with JSON.parse(value). If you are using typescript, you can pass the generic parameter to infer return type|
| **multiSet** | accepts a key-value pair (where the keys must be one of the keys [you have defined](#key-declarations)) to save multiple items at the same time|
| **multiGet** | accepts an arbitrary number of keys that [you have defined](#key-declarations) and returns a key-value pair with the respective values|
| **multiRemove** | accepts an arbitrary number of keys that [you have defined](#key-declarations) and removes multiple items at the same time|
| **clear** | remove everything from local storage|
| **enableLogging** | a function to set the logger active or not. By default it is active if `process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev'`. If it is active, it will log all operations you perform with local storage|


<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- ROADMAP -->

  

## Roadmap

  

  

- [x] Publish initial version

  
[] Add Continuous Integration
[] Add typed bindings between storage keys and the type of value it stores


  

  

See the [open issues](https://github.com/apperside/cross-local-storage/issues) for a full list of proposed features (and known issues).

  

  

<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- CONTRIBUTING -->

  

## Contributing

  

  

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

  

  

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

  

Don't forget to give the project a star! Thanks again!

  

  

1. Fork the Project

  

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

  

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

  

4. Push to the Branch (`git push origin feature/AmazingFeature`)

  

5. Open a Pull Request

  

  

<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- LICENSE -->

  

## License

  

  

Distributed under the MIT License. See `LICENSE.txt` for more information.

  

  

<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- CONTACT -->

  

## Contact

  

  

Apperside - https://apperside.com - info@apperside.com

  

  

Project Link: [https://github.com/apperside/cross-local-storage](https://github.com/apperside/cross-local-storage)

  

  

<p align="right">(<a href="#top">back to top</a>)</p>

  

  

<!-- MARKDOWN LINKS & IMAGES -->

  

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

  

[contributors-shield]: https://img.shields.io/github/contributors/apperside/cross-local-storage.svg?style=for-the-badge

  

[contributors-url]: https://github.com/apperside/cross-local-storage/graphs/contributors

  

[forks-shield]: https://img.shields.io/github/forks/apperside/cross-local-storage.svg?style=for-the-badge

  

[forks-url]: https://github.com/apperside/cross-local-storage/network/members

  

[stars-shield]: https://img.shields.io/github/stars/apperside/cross-local-storage.svg?style=for-the-badge

  

[stars-url]: https://github.com/apperside/cross-local-storage/stargazers

  

[issues-shield]: https://img.shields.io/github/issues/apperside/cross-local-storage.svg?style=for-the-badge

  

[issues-url]: https://github.com/apperside/cross-local-storage/issues

  

[license-shield]: https://img.shields.io/github/license/apperside/cross-local-storage.svg?style=for-the-badge

  

[license-url]: https://github.com/apperside/cross-local-storage/blob/master/LICENSE.txt

  

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

  

[linkedin-url]: https://linkedin.com/in/simonegaspari

  

[product-screenshot]: images/screenshot.png
