# Расширения Хром с помощью реакт

1. Устанавливаем CRA

```bash
npm create-react-app with-react
```

2. Меняем или создаем манифест /public/manifest.json

```json
{
    "short_name": "Your Extension Name",
    "name": "My Extension",
    "description" : "Это расширение является отправной точкой для создания настоящего расширения Chrome" ,
    "version": "0.1.0",
    "manifest_version": 2,
    "chrome_url_overrides" : {
        "newtab" : "index.html"
    },
    "permissions": [

    ],
}

```

3. 1. По умолчанию приложение Create React встраивает небольшой скрипт времени выполнения index.htmlво время производственной сборки, чтобы уменьшить количество HTTP-запросов. Но, к сожалению, вы увидите ошибки консоли, связанные с CSP 

или же просто INLINE_RUNTIME_CHUNK=false в env или package.json



После этого можно сделать чтобы менялось hot reload как расширение

```bash
npm -i customize-cra response-app-rewired copy-webpack-plugin react-app-rewire-multiple-entry --save-dev
```

config-overrides.js 

```js
const {
   override,
   overrideDevServer,
   addWebpackPlugin
} = require("customize-cra");
const CopyPlugin = require('copy-webpack-plugin');

const multipleEntry = require('react-app-rewire-multiple-entry')([
   {
      // points to the popup entry point
      entry: 'src/popup/index.js',
      template: 'public/popup.html',
      outPath: '/popup.html'
   },
   {
      // points to the options page entry point
      entry: 'src/options/index.js',
      template: 'public/index.html',
      outPath: '/index.html'
   }
]);

const devServerConfig = () => config => {
   return {
      ...config,
      // webpackDevService doesn't write the files to desk
      // so we need to tell it to do so so we can load the
      // extension with chrome
      writeToDisk: true
   }
}

const copyPlugin = new CopyPlugin({
   patterns: [
      // copy assets
      { from: 'public', to: '' },
      { from: 'src/background.js', to: '' }
   ]
})

module.exports = {
   webpack: override(
      addWebpackPlugin(
         copyPlugin
      ),
      multipleEntry.addMultiEntry,
   ),
   devServer: overrideDevServer(
      devServerConfig()
   ),

};
```

меняем ещё тут
```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
  ```

  ```bash
  npm run start
  ```
3. 2. Или вот так 

Поскольку сборка CRA создает встроенный скрипт для запуска приложения, вы можете наткнуться на сообщение об ошибке, которое связано с политикой безопасности контента (CSP) в консоли. В сообщении об ошибке вы получите значение sha, которое можно добавить в файл manifest.json для решения проблемы.

```    "content_security_policy": "script-src 'self' 'sha256-GgRxrVOKNdB4LrRsVPDSbzvfdV4UqglmviH9GoBJ5jk='; object-src 'self'"```

но тогда 

```bash
yarn run eject
yarn install
```

/config/webpack.config.prod.js

и т.д.

4. Добавляем расширение

```bash
yarn build
```

и в ```chrome://extensions``` помещаем папку build