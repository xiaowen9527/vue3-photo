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
</script>

<template>
    <div>
        index
    </div>
</template>

<style lang='scss' scoped></style>