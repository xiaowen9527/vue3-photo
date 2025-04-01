<!-- description:  -->
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

    onMounted(() => {
        getType()
    })

    const type = ref([])	// 所有的id
    const getType = async () => {
        loading.value = true
        try {
            let { data } = await axios.get("/mock/278980388")
            type.value = data.data.type
        } finally {
            loading.value = false
        }
    }

    /** 列表 */
    const list = ref([]);
    const currIndex = ref(0)	// 当前显示的id下标(页码)
    const count = ref(2)	// 每次显示笔记用户的id数量
    const getList = async (e) => {

        await getType()


        return

        let { data } = await axios.get("/mock/278316193?type=1")
        let list = data.data
        list.value = shuffleArray(list)
        console.log(list.value, '----list');
        
    }
    /** 洗牌发打乱数组 */
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            // 生成一个 0 到 i 之间的随机整数
            const j = Math.floor(Math.random() * (i + 1));
            // 交换 array[i] 和 array[j] 的位置
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const onRefresh = () => {
        console.log('刷新');
    };


</script>

<template>
    <!-- 骨架屏加载中 -->
    <section class="container list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list :loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
                @load="getList">
                <div class="item" v-for="(item, i) in list" :key="i">
                    <div class="item-img">
                        <img class="item-pic" :src="item" />
                        <!-- <van-icon class="video-icon" name="play-circle-o" size="24" color="#fff"
                            v-if="item.type == 'video'" /> -->
                    </div>
                    <!-- <div class="user"> -->
                        <!-- <img class="user-avatar" :src="item.avatar" /> -->
                        <!-- <span class="item-tle">标题</span> -->
                        <!-- <img class="user-avatar" :src="item.avatar" />
                        <span class="item-tle">{{ item.title }}</span> -->
                    <!-- </div> -->
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