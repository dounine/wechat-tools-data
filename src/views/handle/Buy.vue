<template>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>实时(u)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="onlineConfig.disabled"
        :min="onlineConfig.min"
        :max="onlineConfig.max"
        :setup="onlineConfig.setup"
        :marks="onlineConfig.marks"
        :show-input="onlineConfig.showInput"
        v-model="online"
        range
      >
      </el-slider>
    </el-col>
  </el-row>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>反弹(u)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="reboundConfig.disabled"
        :min="reboundConfig.min"
        :max="reboundConfig.max"
        :setup="reboundConfig.setup"
        :marks="reboundConfig.marks"
        :show-input="reboundConfig.showInput"
        v-model="rebound"
      >
      </el-slider>
    </el-col>
  </el-row>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>差价(u)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="spreadConfig.disabled"
        :min="spreadConfig.min"
        :max="spreadConfig.max"
        :setup="spreadConfig.setup"
        :marks="spreadConfig.marks"
        :show-input="spreadConfig.showInput"
        v-model="spread"
      >
      </el-slider>
    </el-col>
  </el-row>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>调度(s)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="schedulingConfig.disabled"
        :min="schedulingConfig.min"
        :max="schedulingConfig.max"
        :setup="schedulingConfig.setup"
        :marks="schedulingConfig.marks"
        :show-input="schedulingConfig.showInput"
        v-model="scheduling"
      >
      </el-slider>
    </el-col>
  </el-row>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>超时(s)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="timeoutConfig.disabled"
        :min="timeoutConfig.min"
        :max="timeoutConfig.max"
        :setup="timeoutConfig.setup"
        :marks="timeoutConfig.marks"
        :show-input="timeoutConfig.showInput"
        v-model="timeout"
      >
      </el-slider>
    </el-col>
  </el-row>
  <el-row align="middle" type="flex" class="row">
    <el-col :span="2">
      <span>数量(张)</span>
    </el-col>
    <el-col :span="21">
      <el-slider
        :disabled="volumnConfig.disabled"
        :min="volumnConfig.min"
        :max="volumnConfig.max"
        :setup="volumnConfig.setup"
        :marks="volumnConfig.marks"
        :show-input="volumnConfig.showInput"
        v-model="volumn"
      >
      </el-slider>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      online: [30, 60],
      onlineConfig: {
        min: 0,
        max: 100,
        setup: 0.5,
        disabled: true,
        showInput: false,
        marks: {
          0: "0",
          50: "50",
          100: "100",
        },
      },
      rebound: 10,
      reboundConfig: {
        min: 0,
        max: 50,
        setup: 1,
        disabled: false,
        showInput: false,
        marks: {
          0: "0",
          50: "50",
        },
      },
      spread: 30,
      spreadConfig: {
        min: 0,
        max: 50,
        setup: 1,
        disabled: false,
        showInput: false,
        marks: {
          0: "0",
          50: "50",
        },
      },
      scheduling: 10,
      schedulingConfig: {
        min: 0,
        max: 50,
        setup: 1,
        disabled: false,
        showInput: false,
        marks: {
          0: "0",
          50: "50",
        },
      },
      timeout: 3,
      timeoutConfig: {
        min: 0,
        max: 60,
        setup: 1,
        disabled: false,
        showInput: false,
        marks: {
          0: "0",
          60: "60",
        },
      },
      volumn: 1,
      volumnConfig: {
        min: 0,
        max: 50,
        setup: 1,
        disabled: false,
        showInput: true,
        marks: {
          0: "0",
          50: "50",
        },
      },
    };
  },
  created() {
    console.log("buy createed");
  },
};
</script>
<style scoped>
.row {
  min-height: 70px;
}
</style>
