<!-- description: index -->
<!-- fileName: Index.vue -->
<!-- author: iwen(1044803551@qq.com) -->

<script setup>
import axios from 'axios'


// 加载中的状态
const loading = ref(false)
// 数据全部加载完的状态
const finished = ref(false);
// 下拉刷新状态
const refreshing = ref(false);

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
	refreshing.value = false
	notesData.value = []
	getNotes()
}

/**
 *  获取每个用户的笔记合集
 * @param {*} e String 用户id
 */
const notesData = ref([])	// 所有的笔记合集
const currIndex = ref(0)	// 当前显示的id下标(页码)
const count = ref(4)	// 每次显示笔记用户的id数量
const getNotes = async () => {
	console.log(currIndex.value, count.value, '---bbbmbmm');

	loading.value = true
	let listIds = listId.value.slice(currIndex.value, count.value)
	
	listIds.forEach(async (e) => {
		let d = await axios.get('/xhs/user/profile/' + e + params)
		if (d.data.length > 10000) {
			let dd = d.data.split("window.__INITIAL_STATE__=")[1].split('}}<\/script>')
			let ddd = dd[0] + '}}'
			let json = eval("(" + ddd + ")");

			// 每个用户的笔记合集(小红书会返回每个用户的笔记合集前6个)
			let notes = json.profile?.noteData ?? json?.user?.notes?.[0] ?? []

			console.log(notes,'----');
			// 将每个用户的笔记合集添加到notesData中
			if (notes.length) {
				notesData.value = notesData.value.concat(notes)
			}
		}
	})
	console.log(notesData.value, '获取到当前页用户的笔记合集');


	loading.value = false

	if (currIndex.value >= listId.value.length) {
		finished.value = true
		console.log(notesData.value, '获取所有用户的笔记合集成功');
		// 所有数据加载完
	} else {
		currIndex.value += 1
		console.log(currIndex.value, '当前页');
		console.log(notesData.value, '翻页');
	}

}



onMounted(() => {
	getListId()
})

const pic = 'https://pic1.imgdb.cn/item/67b5a56cd0e0a243d400c644.jpg'
</script>

<template>
	<!-- 骨架屏加载中 -->
	<van-skeleton v-if="loading">
		<template #template>
			<div class="caontainer skeleton-container">
				<div class="item" v-for="(item, i) in 10" :key="i">
					<div class="item-img">
						<van-skeleton-image class="skeleton-img" />
					</div>
					<van-skeleton-paragraph class="item-tle" />
				</div>
			</div>
		</template>
	</van-skeleton>
	<!-- 显示数据 -->
	<div class="container list" v-else>
		<!-- <div class="container list"> -->
		<!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
		<div class="item" v-for="(item, i) in 24 " :key="i" @click="getNotes">
			<div class="item-img">
				<!-- <img class="item-img" :src="pic" /> -->
			</div>
			<span class="item-tle">{{ item.title }}</span>
		</div>
		<!-- </van-list>
		</van-pull-refresh> -->
	</div>


	<!-- <div :style="{ display: 'flex', width: '100%' }">
		<van-skeleton-image />
		<van-skeleton-image />
	</div> -->

</template>

<style lang='scss' scoped>
.van-skeleton {
	padding: 0 12px;
	box-sizing: border-box;

	.skeleton-container {
		display: flex;
		flex-direction: row;
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
			margin-top: 12px;

			.item-img {
				width: 100%;
				height: 226px;
				background-color: #ccc;

				.skeleton-img {
					width: 100%;
					height: 100%;
					display: flex;
				}
			}

			.item-tle {
				height: 30px;
				margin-top: 12px;
			}
		}
	}
}


.list {
	padding: 0 12px;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	overflow: hidden;
	overflow-y: scroll;

	// .van-pull-refresh {
	// 	width: 100%;

	// 	.van-list {
	// 		display: flex;
	// 		flex-direction: row;
	// 		flex-wrap: wrap;
	// 		justify-content: space-between;

	.item {
		height: 256px;
		width: 170px;
		display: flex;
		flex-direction: column;
		align-items: center;
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
			line-height: 30px;
			padding: 4px 12px;
			box-sizing: border-box;
			font-size: 12px;
			display: -webkit-box;
			/* 设置为WebKit内核的弹性盒子模型 */
			-webkit-box-orient: vertical;
			/* 垂直排列 */
			-webkit-line-clamp: 1;
			/* 限制显示两行 */
			overflow: hidden;
			/* 隐藏超出范围的内容 */
			text-overflow: ellipsis;
			/* 使用省略号 */
		}
	}

	// 	}
	// }


}
</style>