<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-10 17:02:14
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-12 16:47:23
-->
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import FireEffect from "@/utils/cesiumCtrl/fire.js"
import { useStore } from 'vuex';
import * as Cesium from "cesium"
import { sleep } from "@/common/utils"


const store = useStore()
const { viewer } = store.state

let fire
const onInit = async () => {
  viewer.camera.flyTo({
    // 从以度为单位的经度和纬度值返回笛卡尔3位置。
    destination: Cesium.Cartesian3.fromDegrees(117.28159,31.867281),
    orientation: {
    // heading：默认方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角。
    // pitch：默认角度为-90，即朝向地面，正角度在平面之上，负角度为平面下，即上下旋转，也叫俯仰角。
    // roll：默认旋转角度为0，左右旋转，正角度向右，负角度向左，也叫翻滚角
    heading: Cesium.Math.toRadians(0.0), // 正东，默认北
    pitch: Cesium.Math.toRadians(0), // 向正下方看
    roll: 0.0, // 左右
  },
    duration: 3, // 飞行时间（s）
  })
  await sleep(3000)
  fire = new FireEffect(viewer)

}

const onClear = () => {
  fire.remove()
}
onUnmounted(() => {
  if (fire) {
    fire.remove()
  }
})

</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onInit">渲染火焰</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style lang='less' scoped></style>