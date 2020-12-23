<template>
  <div
    style="margin-top: 40vh"
    v-if="loading"
    v-loading="true"
    element-loading-text="正在查询..."
  />
  <div v-if="positions.length > 0">
    <div class="nav">
      <el-page-header @back="goBack" content="操作页面" />
    </div>
    <div style="height: 20px"></div>
    <el-row justify="end">
      <el-col :span="12">
        <span style="margin-left: 20px; height: 40px; line-height: 40px">{{
          $route.params.symbol
        }}</span>
      </el-col>
      <el-col :span="12">
        <el-row justify="end" type="flex">
          <el-radio-group
            size="medium"
            v-model="contractType"
            @change="switchContractType"
          >
            <el-radio-button
              v-for="ct in findContractTypes"
              :label="ct.value"
              :key="ct.value"
              >{{ ct.name }}</el-radio-button
            >
          </el-radio-group>
        </el-row>
      </el-col>
    </el-row>
    <div style="height: 50px"></div>
    <div>
      <el-tabs v-model="direction" type="card" @tab-click="directionHandleClick">
        <el-tab-pane
          v-for="d in findDirections"
          :label="d.name"
          :name="d.value"
          :key="d.value"
        >
          <router-view v-if="d.value == 'buy' ? isBuy : isSell" :key="$route.path" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      direction: this.$route.params.direction,
      contractType: this.$route.params.contractType,
      symbolInfo: {},
    };
  },
  computed: {
    ...mapState(["positions", "loading"]),
    isBuy() {
      return this.$route.params.direction == "buy";
    },
    isSell() {
      return this.$route.params.direction == "sell";
    },
    findDirections() {
      const symbolItem = this.$store.state.positions.find(
        (p) => p.name == this.$route.params.symbol
      );
      if (symbolItem) {
        return symbolItem.directions || [];
      }
      return [];
    },
    findContractTypes() {
      const symbolItem = this.$store.state.positions.find(
        (p) => p.name == this.$route.params.symbol
      );
      if (symbolItem) {
        return symbolItem.contractTypes || [];
      }
      return [];
    },
  },
  methods: {
    directionHandleClick(tab) {
      const params = this.$route.params;
      this.$router.push({
        path: `/${params.platform}/${params.symbol}/${params.contractType}/${tab.props.name}/${params.offset}`,
      });
    },
    goBack() {
      this.$router.push({
        path: `/${this.$route.params.platform}`,
      });
    },
    switchContractType(contractType) {
      this.contractType = contractType;
      const params = this.$route.params;
      this.$router.push({
        path: `/${params.platform}/${params.symbol}/${contractType}/${params.direction}/${params.offset}`,
      });
    },
    initContractType() {
      this.contractType = this.$route.params.contractType || "quarter";
    },
  },
};
</script>
<style>
.nav {
  padding: 10px;
}
</style>
