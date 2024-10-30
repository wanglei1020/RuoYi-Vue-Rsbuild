import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginVue2 } from '@rsbuild/plugin-vue2'
import { pluginSass } from '@rsbuild/plugin-sass'
import * as path from 'node:path'

const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'] })

function resolve(dir) {
  return path.join(__dirname, dir)
}

export default defineConfig({
  plugins: [
    pluginVue2(),
    pluginSass({
      sassLoaderOptions: {
        warnRuleAsWarning: false,
      },
    }),
  ],
  source: {
    // 指定入口文件
    entry: {
      index: './src/main.js',
    },
    define: publicVars,
    alias: {
      '@': './src',
    },
  },
  html: {
    template: './public/index.html',
  },
  output: {
    polyfill: 'entry',
  },
  tools: {
    bundlerChain(config) {
      // set svg-sprite-loader
      config.module
        .rule('svg')
        .exclude.add(resolve('src/assets/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]',
        })
        .end()
    },
  },
})
