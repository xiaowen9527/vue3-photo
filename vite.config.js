import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'          //自动按需引入 vue\vue-router\pinia\vueuse 等的api
import Components from 'unplugin-vue-components/vite'     //自动按需引入 第三方的组件库组件 和 我们自定义的组件
import postcssPxConversion from 'postcss-px-conversion';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		// 
		AutoImport({
			dts: './src/auto-imports.d.js',
			imports: ['vue', 'pinia', 'vue-router'],
			vueTemplate: true, // 是否在 vue 模板中自动导入
		}),
		Components({
			dts: './src/components.d.js',
			// imports 指定组件所在位置，默认为 src/components
			dirs: ['src/components/'],
			// 自动导入组件
			resolvers: []
		}),
	],
	css: {
		postcss: {
			plugins: [
				postcssPxConversion({
					unitType: "px", // 要从哪种单位转换（默认为'px'）
					viewportWidth: 375,
					unitPrecision: 10,
					viewportUnit: "vw",
					minPixelValue: 1,
				}),
			],
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
	server: {
		port: 5173, // 服务端口号
		open: false, // 服务启动时是否自动打开浏览器
		cors: true, // 允许跨域
		proxy: {
			'/mock': {
				target: 'https://apifoxmock.com/m1/5835688-5521372-default/',//对面接口
				changeOrigin: true,
				rewrite: (path) => path.replace('/mock', '')
			},
			'/xhs': {
				target: 'https://www.xiaohongshu.com/',//对面接口
				changeOrigin: true,
				rewrite: (path) => path.replace('/xhs', '')
			}
		},
		allowedHosts: ['cg1nu2r1-zqtph8ki-z7q3heszfzd8.vcb4.mcprev.cn']
	}
})
