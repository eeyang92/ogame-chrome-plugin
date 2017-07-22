# React + Flow + Webpack + Chrome Extension Boilerplate

> Fork of https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate /w React

## Notable Changes

- Webpack changed to be more configuration/CLI based
- Support for Flow
- Standardized ES2015 syntax across entire project
- Production build will automatically zip the dist directory

## Installaton

1. Clone the repository.
2. `yarn install`
3. Change the package's name and description on `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm run start`
6. Load your extension on Chrome following:
	- Access `chrome://extensions/`
	- Check `Developer mode`
	- Click on `Load unpacked extension`
	- Select the `dist` folder.

## Structure

All extension development code must be placed in `src` folder, including the extension manifest.

## Custom Webpack Dev Server Port

```
PORT=3000 npm run start
```

## Packing

```
npm run build
```
`./dist` will now contain the unpackaged build

`./zip` will contain the package build to be submitted to the Chrome Web Store

## Secrets

Files containing secret keys are resolved as `./secrets.<NODE_ENV>.js`:

_./secrets.development.js_

```js
export default { key: '123' };
```

_./secrets.production.js_

```js
export default { key: '234' };
```

_./src/popup.js_

```js
import secrets from 'secrets';
ApiCall({ key: secrets.key });

// npm run start => '123'
// npm run build => '234'
```
Files with name `secrets.*.js` already are ignored on the repository