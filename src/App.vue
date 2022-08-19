<template>
    <div class="relative">
        <p class="text">Click somewhere !</p>
        <ThreeScene />
    </div>
</template>

<script>
import ThreeScene from "./components/ThreeScene.vue";

export default {
    name: "App",
    components: {
        ThreeScene,
    },
};
</script>

<style lang="stylus">
body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
.relative {
    position: relative;
}
.text {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
}
</style>
