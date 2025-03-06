<!-- description:  -->
<!-- fileName: Index.vue -->
<!-- author: iwen(1044803551@qq.com) -->

<script setup>
    import axios from 'axios'

    const list = ref([]);
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

        // 执行一遍就获取到token(避免过期)
        let token = axios.get("/xhs")

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
    const count = ref(2)	// 每次显示笔记用户的id数量
    const getNotes = async () => {
        loading.value = true
        let listIds = listId.value.slice(currIndex.value * count.value, (currIndex.value + 1) * count.value)
        console.log(currIndex.value * count.value, (currIndex.value + 1) * count.value)

        if (currIndex.value * count.value >= listId.value.length) {
            console.log('没有下一页了');
            finished.value = true
            return
        }

        let list = []
        for (let i = 0; i < listIds.length; i++) {
            const e = listIds[i];
            let d = await axios.get('/xhs/user/profile/' + e + params)
            if (d.data.length > 10000) {
                let dd = d.data.split("window.__INITIAL_STATE__=")[1].split('}}<\/script>')
                let ddd = dd[0] + '}}'
                let json = eval("(" + ddd + ")");

                // 每个用户的笔记合集(小红书会返回每个用户的笔记合集前6个)
                let note = json.profile?.noteData ?? json?.user?.notes?.[0] ?? []
                list = list.concat(note)

                // 当前页几个用户id都循环走完接口了
                if (i == count.value - 1) {
                    loading.value = false
                    console.log(list);

                    let lists = shuffleArray(list)

                    lists.forEach((item, index) => {
                        let noteCard = item.noteCard
                        let obj = {}

                        if (noteCard?.xsecToken) {
                            obj = ({
                                cover: noteCard.cover.urlDefault,
                                type: noteCard.cover.type,
                                title: noteCard.displayTitle,
                                avatar: noteCard.user.avatar,
                                userid: e
                            })
                        } else {
                            obj = ({
                                cover: item.cover.url,
                                title: item.title,
                                type: item.type,
                                avatar: item.user.image,
                                id: item.id,
                                userid: e
                            })
                        }
                        notesData.value.push(obj)
                    })
                }
            }

            // 判断当前次是否全部加载完了.是否翻页
            if (i == listIds.length - 1) {
                // 翻页
                currIndex.value += 1
            }
        }
    }
    // 洗牌发打乱数组
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            // 生成一个 0 到 i 之间的随机整数
            const j = Math.floor(Math.random() * (i + 1));
            // 交换 array[i] 和 array[j] 的位置
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    /**
     * 下拉刷新
     */
    const onRefresh = () => {
        // 清空列表数据
        finished.value = false;

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        loading.value = true;
        getListId();
    };

    onMounted(() => {
        getListId()
    })
</script>

<template>
    <!-- 骨架屏加载中 -->
    <section class="container list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
                @load="getNotes">
                <!-- <div class="item" style="width: 50%;" v-for="item in notesData" :key="item">{{ item }}</div> -->
                <div class="item" v-for="(item, i) in notesData" :key="i">
                    <div class="item-img">
                        <img class="item-pic" :src="item.cover" />
                        <van-icon class="video-icon" name="play-circle-o" size="24" color="#fff" v-if="item.type=='video'" />

                    </div>
                    <div class="user">
                        <img class="user-avatar" :src="item.avatar" />
                        <span class="item-tle">{{ item.title }}</span>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </section>
</template>

<style lang='scss' scoped>
    .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: hidden;
        overflow-y: scroll;

        .van-pull-refresh {
            width: 100%;

            .van-list {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-evenly;

                .item {
                    width: 46vw;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba($color: #000000, $alpha: 0.3);
                    margin-top: 2vw;
                    position: relative;

                    .item-img {
                        min-height: 226px;
                        width: 100%;
                        flex: 1;
                        display: flex;
                        align-items: center;

                        .item-pic {
                            display: block;
                            min-height: 226px;
                            width: 100%;
                            height: auto;
                        }
                    }

                    .video-icon {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                    }

                    .user {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        width: 100%;
                        height: 40px;
                        box-sizing: border-box;
                        background: #fff;

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
                            margin-right: 10px;
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

                &::v-deep() {
                    .van-list__loading {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                }
            }

        }
    }
</style>