<template>
  <router-view :key="$route.path" />
  <el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
    <pre class="preview">{{ copyStr }}</pre>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="copy">复制</el-button>
      </span>
    </template>
  </el-dialog>
  <div>
    <div class="operator-box" v-if="render">
      <div class="operator-title">
        <span class="operator-title-name">游戏列表</span>
        <div style="float: right; margin-right: 10px">
          <el-button-group>
            <el-button
              :disabled="!enable"
              icon="el-icon-plus"
              @click="queryGold"
            ></el-button>
            <el-button
              @click="formatter"
              :disabled="!enable || golds.length == 0"
              itype="primary"
              icon="el-icon-document-copy"
            ></el-button>
          </el-button-group>
        </div>
      </div>
      <div class="operator-divider"></div>
      <div class="operator-content">
        <div class="operator-item" v-for="item in golds" :key="item.id">
          <div
            style="
              width: 140px;
              height: 140px;
              text-align: center;
              line-height: 140px;
              display: inline-block;
            "
          >
            <img
              v-if="item.imgUrl && item.finish == undefined"
              :src="item.imgUrl"
              class="operator-scan"
              alt=""
            />
            <div v-if="!item.imgUrl">
              <i class="el-icon-loading" />
              <span style="color: #606266; margin-left: 4px">二维码获取中...</span>
            </div>
            <div v-if="item.finish === false">
              <i class="el-icon-loading" />
              <span style="color: #606266; margin-left: 4px">数据获取中...</span>
            </div>
            <div v-if="item.finish === true">
              <el-button type="success" icon="el-icon-check" circle></el-button>
              <span style="color: #606266; margin-left: 4px">数据获取成功</span>
            </div>
          </div>
          <div
            class="operator-info"
            style="color: #606266; font-size: 14px"
            v-if="!item.gold && item.timeout"
          >
            请在{{ item.timeout }}秒内完成扫码
          </div>
          <div class="operator-info" v-if="item.gold">
            <div style="line-height: 30px">
              <span style="color: #909399">游戏: </span>
              <span style="color: #606266; font-weight: 600">{{ item.name }}</span>
            </div>
            <div style="line-height: 30px">
              <span style="color: #909399">广告金: </span>
              <span style="color: #606266; font-weight: 600">{{ item.gold }}</span>
            </div>
            <div style="line-height: 30px">
              <span style="color: #909399">广告余额: </span>
              <span style="color: #606266; font-weight: 600">{{ item.expireGold }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" v-loading="false" element-loading-text="正在查询..." />
  <div v-if="!enable" v-loading="true" element-loading-text="连接已断开、请刷新页面" />
  <div
    v-if="golds.length === 0"
    style="text-align: center; color: #c0c4cc; font-size: 14px"
  >
    <i class="el-icon-info"></i> 点击右上角添加、然后为每个二维码选择对应的游戏登录即可。
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import { wsUrl } from "../../package.json";
export default {
  data() {
    return {
      dialogVisible: false,
      enable: false,
      copyStr: "",
      scanImg: require("../assets/images/scan.jpeg"),
    };
  },
  created() {
    console.log("created");
    this.socket = new WebSocket(`${wsUrl}/ws/gold`);
    this.socket.onclose = () => {
      this.enable = false;
    };
    this.socket.onopen = () => {
      this.enable = true;
      console.log("onopen");
    };
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type == "gold") {
        this.$store.dispatch("addGold", data.data);
      }
    };
  },
  computed: {
    ...mapState(["positions", "golds", "loading"]),
    platform() {
      return this.$route.params.platform;
    },
    render() {
      return this.$route.params.symbol == undefined;
    },
  },
  methods: {
    copy() {
      const _input = document.createElement("input"); // 直接构建input
      _input.value = this.copyStr; // 设置内容
      document.body.appendChild(_input); // 添加临时实例
      _input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(_input);
      this.dialogVisible = false;

      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    formatter() {
      this.copyStr =
        "游戏\t余额\t即将过期金额\n" +
        this.golds
          .filter((item) => item.name)
          .map((item) => {
            return `${item.name}\t${item.gold}\t${item.expireGold}`;
          })
          .join("\n");
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    queryGold() {
      this.socket.send(
        JSON.stringify({
          type: "gold",
        })
      );
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
};
</script>
<style>
.operator-box {
  width: 100%;
  background-color: white;
}
.operator-box .operator-divider {
  height: 1px;
  background-color: #e4e7ed;
  margin-right: 20px;
}
.operator-box .operator-title .operator-title-name {
  color: #606266;
}
.operator-box .operator-title {
  height: 50px;
  line-height: 50px;
  text-indent: 30px;
  margin-right: 20px;
}
.operator-box .operator-content {
  margin-top: 20px;
  margin-right: 20px;
  padding-bottom: 20px;
}
.operator-box .operator-item {
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.operator-box .operator-item .iconName {
  width: 40px;
  height: 40px;
}
.operator-box .operator-item .symbolName {
  font-size: 18px;
  color: #606266;
}
.operator-scan {
  width: 140px;
  height: 140px;
}
.operator-box .operator-item .symbolDetail {
  font-size: 14px;
  color: #909399;
}
.operator-info {
  float: right;
  margin-right: 20px;
}
</style>
