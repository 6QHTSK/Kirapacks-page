function LoadCard(){
console.log("Loaded songCard!");
var text_songcard="Loaded songCard! text";
return songCard={
    template: "#cardtemp",/*`
    <el-popover placement="bottom" trigger="click">
    <p style="text-align: center;">请选择游玩 {{item.songname}} 的方式</p>
    <el-button-group style="text-align: center;">
      <el-tooltip class="item" effect="dark" content="在 Bestdori 上查看谱面最高难度" placement="bottom-start">
        <el-button @click="openbdlink(item.id,$event)">Bestdori</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="在 PlayerBanGround 上游玩谱面最高难度" placement="bottom">
        <el-button @click="openpbbblink(item.id,$event)">PlayerBanGround</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下载全难度 Kirapack" placement="bottom-end">
        <el-button @click="openkirapack(item.id,$event)">Kirapack</el-button>
      </el-tooltip>
    </el-button-group>
    <el-card :body-style="{ padding: '5px'}" slot="reference" shadow="hover">
      <div class="topcard">
        <el-col :span="5">
          <el-tag type="info">{{item.id}}</el-tag>
        </el-col>
        <el-col :span="19">
          <div class="difficulty" v-for="i of 5">
            <div v-if="item.diff[5-i]!='-1'">
              <el-tag :class="diffname[5-i]" width="150px">{{item.diff[5-i]}} </el-tag>
            </div>
          </div>
        </el-col>
      </div>
      <div class="imagebox">
        <el-image :src="item.imgsrc" class="image">
            <div slot="error" class="imagefail">
                <i class="el-icon-picture-outline"></i>
            </div>
            <div slot="placeholder" class="imagefail">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
      </div>
      <div style="padding:14px;">
        <div class="metadata">{{item.origin}}</div>
        <div class="songname">{{item.songname}}</div>
        <div class="artist">{{item.artist}}</div>
        <div class="metadata">
          <span v-if="item.time%60>=10">{{Math.floor(item.time/60)}}:{{item.time%60}} </span>
          <span v-else>{{Math.floor(item.time/60)}}:0{{item.time%60}} </span>
          <span v-if="item.bpm[0]==item.bpm[1]">BPM: {{item.bpm[0]}}</span>
          <span v-else>BPM: {{item.bpm[0]}}~{{item.bpm[1]}}</span>
        </div>
        <div>
          <el-tag size="mini">{{item.tags[0]}}</el-tag>
          <el-tag v-if="item.maxdiff>=28" size="mini" type="danger">高难度</el-tag>
          <el-tag v-if="item.diff[0]!='-1' && item.diff[1]!='-1' && item.diff[2]!='-1'" size="mini"
            type="success">已完成</el-tag>
          <el-tag v-if="item.time>=160" size="mini" type="danger">FULL</el-tag>
          <el-tag v-if="item.video" size="mini" type="warning">含视频</el-tag>
        </div>
      </div>
    </el-card>
    </el-popover>
    `,*/
    props:["item"],
    data: function(){
        return{
            diffname: ["easy", "normal", "hard", "expert", "special"]
        }
    },
    methods: {
        openbdlink(id, e) {
          window.open('https://bestdori.com/community/charts/' + id, "_blank");
        },
        openpbbblink(id, e) {
          window.open('https://player.banground.fun/?id=' + id + '&type=community&autoload=true', "_blank")
        },
        openkirapack(id, e) {
          alert("暂不支持kirapack下载，请等待BG社区上线")
        }
    },
    }
}

