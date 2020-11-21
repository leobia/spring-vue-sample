# Intro

Semplice starter per un progetto gradle con vue.js + spring-boot

I componenti utilizzati sono i seguenti:

 * spring-boot(Java web application framework)
 * webpack(Javascript bundler)
 * npm(Javascript package manager)
 * babel(Utilizzato per trasformare ES2015 per i vecchi browser)
 * vue.js(front end framework)

La struttura delle directory è la seguente:

    src/main/java/                        ← java code
    src/main/js/                          ← JS code
    build/resources/main/static/bundle.js ← JS compilato

Quello che si ottiene alla fine è un `fat-jar` (jar con le dipendenze al suo interno) che contiene anche gli artifatti webpack: `./gradlew build`

# Configurazione

1. Aggiornare node.js all'ultima LTS
2. Installa webpack globalmente (così da poterlo chiamare direttamente da command-line):
```shell script
npm install -g webpack
```
3. Installare npm, questo genererà un file di configurazione `package.json` che conterrà anche le varie dipendenze
```shell script
npm install -y
```
4. Installare le dipendenze per lo sviluppo
```shell script
npm install --save-dev webpack babel-core babel-preset-es2015 babel-loader vue-loader vue-style-loader vue-html-loader vue-template-compiler file-loader node-sass sass-loader style-loader url-loader css-loader extract-text-webpack-plugin webpack
```
5. Installare vue, vue-router e axios (chiamate http) con il flag `--save`
```shell script
npm install --save vue vue-router axios
```

6. Per un bug di babel andare nel `package.json` ed aumentare la versione in questo modo:
```
    "@babel/core": "^7.9.0",
    "@babel/preset-env": "^7.9.0",
```
7. Rilanciare `npm install`

# Configurazione eslint + prettier

I file .eslintrc.js e .eslintrc.json sono i file dedicati alla formattazione e controllo codice js/vue. Per utilizzarlo
```
npm install --global prettier
```
Se si usa visual studio code seguire https://www.digitalocean.com/community/tutorials/vuejs-vue-eslint-plugin

# Configurazione webpack

Webpack è un bundler js/css, il suo scopo è quindi quello di creare un pacchetto di assets utilizzabile direttamente nel browser a partire da un insieme di file sorgenti.

Da webpack si chiamano tutte le pre-elaborazioni necessarie sul js, ad esempio Babel (un framework che transpila le nuove versioni di js per i browser più vecchi) e i loader del caso.

MiniCssExtractPlugin viene utilizzato per esportare i file css come file separati.

```javascript
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main/js/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build/resources/main/static'
  },
  module: {
      rules: [
          {
              test: /\.vue$/,
              loader: 'vue-loader'
          },
          {
              test: /\.js$/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['@babel/preset-env']
                  }
              },
              exclude: /node_modules/
          },
          {
              test: /\.css$/i,
              use: [{
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                      publicPath: __dirname + "/build/resources/main/static/css/"
                  }
              }, 'css-loader'],
          },
          {test: /\.svg$/, use: [ {loader: 'url-loader', options: { mimetype: 'image/svg+xml' }} ]},
          {test: /\.woff$/, use: [ {loader: 'url-loader', options: { mimetype: 'application/font-woff' }} ]},
          {test: /\.woff2$/, use: [ {loader: 'url-loader', options: { mimetype: 'application/font-woff' }} ]},
          {test: /\.eot$/, use: [ {loader: 'url-loader', options: { mimetype: 'application/font-woff' }} ]},
          {test: /\.ttf$/, use: [ {loader: 'url-loader', options: { mimetype: 'application/font-woff' }} ]}
      ]
  },
  plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
          filename: "/css/main.css"
      }),
      // IntelliJ IDEA uses out/production/resources/ as a classpath.
      new FileManagerPlugin({
          onEnd: {
              copy: [
                  {
                      source: __dirname + '/build/resources/main/static/js/bundle.js',
                      destination: __dirname + '/out/production/resources/static/js/bundle.js'
                  },
                  {
                      source: __dirname + '/build/resources/main/static/css/main.css',
                      destination: __dirname + '/out/production/resources/static/css/main.css'
                  }
              ]
          }
      })
  ]
}
;
```

Webpack è disponibile utilizzando il commando `webpack`

In fase di sviluppo utilizzando il comando `webpack -w`, questo monitorerà gli aggiornamenti ai file e ripubblicherà il front-end.

# Configurazione gradle

Gradle va configurato in modo tale da eseguire anche webpack quando si lancia `./gradlew build`

```groovy
buildscript {
    repositories {
        mavenCentral()
        jcenter()
    }
    dependencies {
        classpath 'com.moowork.gradle:gradle-node-plugin:0.12'
    }
}

apply plugin: 'java'
apply plugin: "com.moowork.node"

node {
    version = '6.6.0'
    npmVersion = '3.10.7'
    download = true
}

task webpack(type: NodeTask, dependsOn: 'npmInstall') {
    def osName = System.getProperty("os.name").toLowerCase();
    if (osName.contains("windows")) {
        script = project.file('node_modules/webpack/bin/webpack.js')
    } else {
        script = project.file('node_modules/.bin/webpack')
    }
}

processResources.dependsOn 'webpack'

clean.delete << file('node_modules')

```

`./gradlew build` in questo modo eseguirà webpack e mettere il js compilato all'interno del jar.

# `npm run dev` per lo sviluppo locale

All'interno del file package json è stato definito come script `dev` il `webpack -w`

```
{
  "name": "spring-vue-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack -w"
  },
}
```

In questo modo si potrà lanciare facilmente da intellij `npm run dev` e webpack comincerà a fare uno "watch" (-w) e refreshando la pagina si vedranno le modifiche.

# SEE ALSO
Credits to  https://github.com/tokuhirom/spring-vue-samp

 * http://shigekitakeguchi.github.io/2016/08/10/1.html
 * https://webpack.js.org/plugins/extract-text-webpack-plugin/#usage-example-with-css
