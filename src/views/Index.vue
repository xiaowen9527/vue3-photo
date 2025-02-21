<!-- description: index -->
<!-- fileName: Index.vue -->
<!-- author: iwen(1044803551@qq.com) -->

<script setup>
import axios from 'axios'


// 加载中的状态
const loading = ref(false)
// 获取笔记合集的拼接参数
const params = '?xsec_token=ABT7hRcLlGk-rZAIX1JnYYRvGmVEDMi0Txvx3m3ModAA8=&xsec_source=pc_feed'


/**
 *   获取所有的id
 */
const listId = ref([])	// 所有的id
const getListId = async () => {
	loading.value = true
	let listIds = await axios.get("/mock/getList")
	listId.value = listIds.data
	notesLength.value = listId.value.length * 6
	getNotes()
}

/**
 *  获取每个用户的笔记合集
 * @param {*} e String 用户id
 */
const notesData = ref([])	// 所有的笔记合集
const notesLength = ref(0)	// 所有的笔记合集的长度
const currentPage = ref(1)	// 当前的页码
const count = ref(20)	// 每页显示的数量
const getNotes = () => {

	listId.value.forEach(e => {
		// 获取每个用户的笔记合集
		axios.get('/xhs/user/profile/' + e + params)
			.then(res => {
				let d = res.data;
				// 长度大于1000才算成功获取到网页的内容
				if (d.length > 10000) {
					let dd = d.split("window.__INITIAL_STATE__=")[1].split('}}<\/script>')
					let ddd = dd[0] + '}}'
					let json = eval("(" + ddd + ")");

					// 每个用户的笔记合集(小红书会返回每个用户的笔记合集前6个)
					let notes = json.profile?.noteData ?? json?.user?.notes?.[0] ?? []

					// 将每个用户的笔记合集添加到notesData中
					if (notes.length) {
						notesData.value = notesData.value.concat(notes)

						// 当notesData的长度等于notesLength时，说明已经获取到所有用户的笔记合集
						if (notesData.value.length == notesLength.value) {
							loading.value = false
							console.log(notesData.value,'获取所有用户的笔记合集成功');
						}
					}
				}
			}).catch(err => {
				console.log(err);
				loading.value = false
			})
	})
}




getListId()


const pic = 'https://pic1.imgdb.cn/item/67b5a56cd0e0a243d400c644.jpg'
</script>

<template>
	<div class="container list">
		<!-- <div class="item" v-for="(item, i) in 10" :key="i">
			<div class="item-img">
				<img class="item-img" :src="pic" />
			</div>
			<span class="item-tle">芦叶满汀洲芦叶满汀洲芦叶满汀洲芦叶满汀洲芦叶满汀洲芦叶满汀洲芦叶满汀洲芦叶满汀洲</span>
		</div> -->
	</div>
</template>

<style lang='scss' scoped>
.list {
	padding: 0 12px;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	overflow: hidden;
	overflow-y: scroll;

	.item {
		height: 256px;
		width: 170px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ff0;
		margin-top: 12px;

		.item-img {
			width: 100%;
			height: 226px;
			background-color: #ccc;
		}

		.item-tle {
			font-size: 14px;
			color: #333;
			display: flex;
			width: 170px;
			justify-content: center;
			align-items: center;
			line-height: 20px;
			height: 48px;
			padding: 4px 12px;
			box-sizing: border-box;
			font-size: 12px;
			display: -webkit-box;
			/* 设置为WebKit内核的弹性盒子模型 */
			-webkit-box-orient: vertical;
			/* 垂直排列 */
			-webkit-line-clamp: 2;
			/* 限制显示两行 */
			overflow: hidden;
			/* 隐藏超出范围的内容 */
			text-overflow: ellipsis;
			/* 使用省略号 */
		}
	}
}
</style>