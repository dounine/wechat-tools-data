<template>
  <router-view :key="$route.path" />
  <el-dialog title="扫码登录" v-model="qrcodeVisable" width="30%">
    <div style="text-align: center">
      <img style="width: 300px; height: 300px" v-if="scanImg" :src="scanImg" />
      <i class="el-icon-loading" v-if="!scanImg"></i>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-checkbox-group
          v-model="checkList"
          @change="checkListChange"
          style="display: inline-block; margin-right: 20px"
        >
          <el-checkbox label="query">自动抓数据</el-checkbox>
          <el-checkbox label="close">自动关闭窗口</el-checkbox>
        </el-checkbox-group>
        <el-button @click="qrcodeVisable = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeVisable = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="批量导入" v-model="batchEditorVisable" width="30%">
    <div>
      <span>
        例子：
        <span style="color: #909399; display: inline-block; margin-bottom: 10px"
          >游戏id 游戏名[换行]</span
        ></span
      >
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入内容"
        v-model="batchEditorInput"
      >
      </el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="batchEditorVisable = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="
            batchEditorInput.indexOf(' ') === -1 ||
            batchEditorInput.split(' ').filter((item) => {
              return item;
            }).length <= 1
          "
          @click="batchEditorConfirm"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <div>
    <div class="operator-box" v-if="render">
      <div class="operator-title">
        <span class="operator-title-name">游戏列表</span>
        <div style="float: right; margin-right: 10px">
          <div style="display: inline-block; margin-right: 20px">
            <el-dropdown trigger="click" size="small" @command="dayClick">
              <span class="el-dropdown-link">
                {{ day }} 天数据<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="1">1 天</el-dropdown-item>
                  <el-dropdown-item command="3">3 天</el-dropdown-item>
                  <el-dropdown-item command="7">7 天</el-dropdown-item>
                  <el-dropdown-item command="30">30 天</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <el-button-group>
            <el-button
              :disabled="!enable"
              icon="el-icon-picture-outline"
              @click="qrcodeQuery"
            ></el-button>
            <el-button icon="el-icon-edit" @click="batchEdit"></el-button>
            <el-button
              @click="dataQuery"
              :disabled="!enable || !qrcodeLoginSuccess"
              itype="primary"
              icon="el-icon-video-play"
            ></el-button>
            <el-button
              @click="downloadFile"
              :disabled="!enable || !download"
              type="primary"
              icon="el-icon-download"
            ></el-button>
          </el-button-group>
        </div>
      </div>
      <div class="operator-divider"></div>
      <div class="operator-content">
        <el-tag
          :key="tag"
          v-for="tag in channels"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          :effect="
            processing[tag]
              ? processing[tag].success
                ? processing[tag].process
                  ? 'dark'
                  : 'dark'
                : 'dark'
              : 'plain'
          "
          :type="
            processing[tag]
              ? processing[tag].success
                ? processing[tag].process
                  ? 'info'
                  : 'success'
                : 'danger'
              : ''
          "
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          style="margin-top: 20px"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button
          style="margin-left: 10px"
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
          >添加游戏</el-button
        >

        <!-- <div class="operator-item" v-for="item in golds" :key="item.id">
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
        </div> -->
      </div>
    </div>
  </div>
  <div v-if="loading" v-loading="false" element-loading-text="正在查询..." />
  <div v-if="!enable" v-loading="true" element-loading-text="连接已断开、请刷新页面" />
  <div
    v-if="channels.length === 0"
    style="text-align: center; color: #c0c4cc; font-size: 14px"
  >
    <i class="el-icon-info"></i> 右上角可选择批量导入
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
      day: localStorage.getItem("day") || "1",
      checkList: (localStorage.getItem("channelScanConfig") || "query,close")
        .split(",")
        .filter((item) => {
          return item;
        }),
      qrcodeVisable: false,
      qrcodeScan: false,
      batchEditorInput: "",
      processing: {},
      batchEditorVisable: false,
      channels: (localStorage.getItem("channels") || "").split(",").filter((item) => {
        return item;
      }),
      inputVisible: false,
      inputValue: "",
      download: "",
      dialogVisible: false,
      enable: false,
      copyStr: "",
      qrcodeLoginSuccess: false,
      scanImg: "", //require("../assets/images/scan.jpeg"),
    };
  },
  created() {
    console.log("created");
    this.socket = new WebSocket(`${wsUrl}/ws/channel`);
    this.socket.onclose = () => {
      this.enable = false;
    };
    this.socket.onopen = () => {
      this.enable = true;
      console.log("onopen");
    };
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.type === "channel") {
        if (data.data.type === "qrcodeQuery") {
          this.scanImg = data.data.img;
        } else if (data.data.type === "qrcodeLoginSuccess") {
          this.qrcodeLoginSuccess = true;

          this.$message({
            message: "扫码成功",
            type: "success",
          });
          if (this.checkList.includes("close")) {
            this.qrcodeVisable = false;
          }
          if (this.checkList.includes("query")) {
            this.dataQuery();
          }
        } else if (data.data.type === "gameFinish") {
          this.processing[data.data.game] = {
            process: data.data.process,
            success: data.data.success,
          };
        } else if (data.data.type === "gamesFinish") {
          const errorOjb = {};
          Object.keys(this.processing).forEach((item) => {
            console.log(item);
            if (!this.processing[item].success) {
              errorOjb[item] = this.processing[item];
            }
          });
          this.processing = errorOjb;
          this.download = data.data.download;
          this.$message({
            message: "数据抓取完成",
            type: "success",
          });
        }
        console.log(data.data);
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
    checkListChange(value) {
      localStorage.setItem(
        "channelScanConfig",
        this.checkList
          .filter((item) => {
            return item;
          })
          .join(",")
      );
    },
    //二维码获取
    downloadFile() {
      if (this.download) {
        window.open(this.download);
      }
    },
    dataQuery() {
      this.$message({
        message: "开始抓取数据",
        type: "info",
      });
      this.download = "";
      this.processing = {};
      this.socket.send(
        JSON.stringify({
          type: "channel",
          data: {
            type: "dataQuery",
            day: parseInt(this.day),
            games: this.channels,
          },
        })
      );
    },
    qrcodeQuery() {
      this.socket.send(
        JSON.stringify({
          type: "channel",
          data: {
            type: "qrcodeQuery",
          },
        })
      );
      this.qrcodeVisable = true;
    },
    //确认导入
    dayClick(day) {
      this.day = day;
      localStorage.setItem("day", day);
    },
    batchEditorConfirm() {
      this.channels = this.channels.concat(this.batchEditorInput.split("\n"));
      this.batchEditorVisable = false;
      this.batchEditorInput = "";
      localStorage.setItem("channels", this.channels.join(","));
      this.$message({
        message: "添加成功",
        type: "success",
      });
    },
    batchEdit() {
      this.batchEditorVisable = true;
    },
    handleClose(tag) {
      this.channels.splice(this.channels.indexOf(tag), 1);
      localStorage.setItem(
        "channels",
        this.channels
          .filter((item) => {
            return item;
          })
          .join(",")
      );
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        if (
          inputValue.indexOf(" ") !== -1 &&
          inputValue.split(" ").filter((item) => {
            return item;
          }).length === 2
        ) {
          this.channels.push(inputValue);
          localStorage.setItem("channels", this.channels.join(","));
          this.$message({
            message: "添加成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "格式为：游戏ID + 空格 + 游戏名称",
            type: "error",
          });
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

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
.el-tag + .el-tag {
  margin-top: 10px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
