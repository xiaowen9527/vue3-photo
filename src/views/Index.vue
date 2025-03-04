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
    // cosnt par = https://www.xiaohongshu.com/user/profile/5a37dd374eacab5e595036d4?channel_type=explore_feed&parent_page_channel_type=web_profile_board&xsec_token=ABYBUYPPLUuCVPG3Ghg7Lu4P1QNbJ-v8aicupHAUj7QKY=&xsec_source=pc_feed

    /**
     *   获取所有的id
     */
    const listId = ref([])	// 所有的id
    const getListId = async () => {

        // 执行一遍就获取到token(避免过期)
        let token = axios.get("/xhs")

        loading.value = true
        let listIds = await axios.get("/mock/getList")
        listId.value = listIds.data
        refreshing.value = false
        notesDatas.value = []
        getNotes()
    }

    /**
     *  获取每个用户的笔记合集
     * @param {*} e String 用户id
     */
    const notesDatas = ref([])	// 所有的笔记合集
    const currIndex = ref(0)	// 当前显示的id下标(页码)
    const count = ref(4)	// 每次显示笔记用户的id数量
    const notesData = ref([])	// 当前页的笔记合集
    const getNotes = async () => {

        loading.value = true
        let listIds = listId.value.slice(currIndex.value, count.value)

        notesData.value = []
        for (let i = 0; i < listIds.length; i++) {
            const e = listIds[i];
            let d = await axios.get('/xhs/user/profile/' + e + params)
            if (d.data.length > 10000) {
                let dd = d.data.split("window.__INITIAL_STATE__=")[1].split('}}<\/script>')
                let ddd = dd[0] + '}}'
                let json = eval("(" + ddd + ")");

                // 每个用户的笔记合集(小红书会返回每个用户的笔记合集前6个)
                let note = json.profile?.noteData ?? json?.user?.notes?.[0] ?? []
                notesData.value = notesData.value.concat(note)

                // 当前页几个用户id都循环走完接口了
                if (i == count.value - 1) {
                    loading.value = false
                    notesData.value.forEach((item, index) => {
                        let noteCard = item.noteCard
                        let obj = {}

                        if (noteCard?.xsecToken) {
                            obj = ({
                                cover: noteCard.cover.urlDefault,
                                title: noteCard.displayTitle,
                                avatar: noteCard.user.avatar,
                                id: e
                            })
                        } else {
                            obj = ({
                                cover: item.cover.url,
                                title: item.title,
                                avatar: item.user.image,
                                id: e
                            })
                        }
                        notesDatas.value.push(obj)
                    })
                }

                // // 判断是否全部加载完了
                // if (notesDatas.value.length == (currIndex.value + 1) * count.value * 6) {
                //     console.log(notesDatas.value.length,'数据得长度111');
                //     console.log((currIndex.value + 1) * count.value * 6,'数据得长度222');

                // }
            }
        }
    }



    onMounted(() => {
        getListId()
    })

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
        <div class="item" v-for="(item, i) in notesDatas" :key="i" @click="getNotes">
            <div class="item-img">
                <!-- <img class="item-img" :src="item.cover" /> -->
            </div>
            <div class="user">
                <img class="user-avatar" :src="item.avatar" />
                <span class="item-tle">{{ item.title }}</span>
            </div>
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
            height: 266px;
            width: 170px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .item-img {
                width: 100%;
                height: 226px;
                background-color: #ccc;
            }

            .user {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 170px;
                height: 40px;
                box-sizing: border-box;

                .user-avatar {
                    display: block;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin: 0 10px;
                }


                .item-tle {
                    font-size: 14px;
                    color: #333;
                    display: flex;
                    flex: 1;
                    justify-content: center;
                    align-items: center;
                    line-height: 24px;
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

        }

        // 	}
        // }


    }
</style>