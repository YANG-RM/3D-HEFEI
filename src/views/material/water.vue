<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-29 10:14:51
 * @LastEditors: 不浪
 * @LastEditTime: 2024-07-07 11:11:35
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref, onMounted } from "vue";
import WaterManager from "../../utils/cesiumCtrl/water";
const store = useStore();
const { viewer } = store.state;

onUnmounted(() => {
  onClear();
});
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(117.255, 31.853, 40000),
});
// 流动水面效果
const create = () => {
  let waterManager = new WaterManager(viewer);
  addWater("/json/hefei-water.json");
  function addWater(url) {
    var promise = Cesium.GeoJsonDataSource.load(url);
    promise.then(dataSource => {
      waterManager.addWater(dataSource.entities.values, 100)
    }).catch(error => {
      console.error(error);
    });
  }

};

const onClear = () => {
  viewer.scene.primitives.removeAll();
};
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="create">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
