<!-- description: index -->
<!-- fileName: Index.vue -->
<!-- author: iwen(1044803551@qq.com) -->

<script setup>
import axios from 'axios'


let listId = ref([])


const getData = () => {
	axios.get("/mock/getList").then(res => {

		listId.value = res.data
		console.log(listId.value);

		listId.value.forEach(e => {

			axios.get('/xhs/user/profile/' + e)
				.then(res => {
					let d = res.data;
					if (d.length > 10000) {
						let dd = d.slice(
							d.indexOf("window.__INITIAL_STATE__=") + 25,
							-23
						);
						let json = eval("(" + dd + ")");
						console.log(json.user.notes[0]);
					}
				}).catch(err => {
					console.log(err);
				})
		});

		// let d = res.data;
		// if (d.length > 10000) {
		//     let dd = d.slice(
		//         d.indexOf("window.__INITIAL_STATE__=") + 25,
		//         -23
		//     );
		//     let json = eval("(" + dd + ")");
		//     console.log(json.user.notes[0]);
		// }
	}).catch(err => {
		console.log(err);
	})
}
getData()


const pic = 'https://pic1.imgdb.cn/item/67b5a56cd0e0a243d400c644.jpg'
</script>

<template>
	<div class="container">
		<div class="item">
			<img class="item-img" :src="pic" />
			<text class="item-tle" text="芦叶满汀洲"></text>
		</div>
	</div>
</template>

<style lang='scss' scoped></style>