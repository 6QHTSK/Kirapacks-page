//import Chart from "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js";
var lastdiffid = 3;
function getQueryString(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
module.exports = {
    data: function () {
        return {
            diffid: 3, //难度等级 EASY~EXPERT 0~3
            inputstr: "", //从大输入框输入的谱面
            bestdoriid: "", //需要获取的bestdori的id
            chartjson: "", //谱面的解析后的json文件
            diffcolor: "", //不同难度等级对应的颜色
            npsdiff: null, //根据nps计算的难度
            hpsdiff: null, //根据hps计算的难度
            maxhpsdiff : null,
            maxspddiff : null,
            maxfpsfrontdiff : null,
            maxfpsbackdiff : null,
            leftpercent: null,
            bpmlow: null, // 最低的bpm
            bpmhigh: null, // 最高的bpm
            showdetail: false, // 是否打开谱面分析栏
            totalflick: 0, // 粉键的个数
            maxhps: null, // 最高的hps
            maxfpsfront: null, // 最高的fps
            maxfpsback: null,
            maxspd: null, //最高的滑动速度
            totaltimemin: null, // 总计的时间-分
            totaltimesec: null, // 总计的时间-秒
            totalnote: null, // 物量
            totalnps: null, // nps
            totalhitnote: 0, // Hit数
            totalhps: null,// hps
            loading: false, // 是否在拉取数据
            viewhelp: false // 是否查看帮助
        }
    },
    mounted() {
        id = getQueryString("id")
        if (id != false && id != null) {
            this.bestdoriid = id.toString();
            this.getbestdorichart();
        }
    },
    methods: {
        analysis(flag) {
            vm = this
            function procession(res){
                if(res.status == 200 && res.data.result){
                    rtr = res.data.details
                    vm.totalnps = rtr.totalnps.toFixed(2)
                    vm.npsdiff = rtr.totalnpsdiff.toFixed(1)
                    vm.totalhps = rtr.totalhps.toFixed(2)
                    vm.hpsdiff = rtr.totalhpsdiff.toFixed(1)
                    if(rtr.fingermaxhps!=null){
                        vm.leftpercent = (rtr.leftpercent * 100).toFixed(1)
                        vm.maxhps = rtr.fingermaxhps.toFixed(2)
                        vm.maxhpsdiff = rtr.fingermaxhpsdiff.toFixed(1)
                        vm.maxspd = rtr.fingermaxspd.toFixed(2)
                        vm.maxspddiff = rtr.fingermaxspddiff.toFixed(1)
                        if(rtr.fingermaxfpsback!=null){
                            vm.maxfpsback = rtr.fingermaxfpsback.toFixed(2)
                            vm.maxfpsbackdiff = rtr.fingermaxfpsbackdiff.toFixed(1)
                            vm.maxfpsfront = rtr.fingermaxfpsfront.toFixed(2)
                            vm.maxfpsfrontdiff =rtr.fingermaxfpsfrontdiff.toFixed(1)
                        }
                    }
                    else{
                        vm.$notify({
                            title: '单手分析错误',
                            message: rtr.error,
                            type: 'warning'
                          });
                    }
                    vm.loading = false;
                    vm.showdetail = true;
                }
                else{
                    vm.$message("访问数据库失败");
                }
            }
            //console.log("Function analysis do")
            vm.loading = true;
            if (this.inputstr != "" && transferJson(this, this.inputstr)) {
                try {
                    newdiffid = this.diffid > 3 ? 3 : this.diffid
                    information = details(this.chartjson, newdiffid, this.drawchart);
                    this.totaltimemin = information.totaltimemin;
                    this.totaltimesec = information.totaltimesec;
                    this.totalnote = information.totalnote;
                    this.totalhitnote = information.totalhitnote;
                    this.totalflick = information.totalflick;
                    this.bpmlow = information.bpmlow;
                    this.bpmhigh = information.bpmhigh;
                    if (this.totaltimemin * 60 + this.totaltimesec < 20){
                        throw "谱面长度过短"
                    }
                } catch (error) {
                    this.$message("分析过程错误 " + error);
                    vm.loading = false;
                    return false;
                }
            }
            if (flag) {
                url = "http://106.55.249.77/diffanalysis?id="+this.bestdoriid
                if(this.bestdoriid<500){
                    url = url + "&diff=" + this.diffid
                }
                axios.get(url).then(res=>{procession(res)})
            }
            else{
                url = "http://106.55.249.77/diffanalysis"
                data = {"diff":this.diffid,"data":JSON.parse(this.inputstr)}
                axios.post(url,data).then(res=>{procession(res)})
            }
            return true
        },
        inputchange(e) {
            //console.log("Function inputchange do")
            this.$forceUpdate();
        },
        calcpercentage(diffnum) {
            //console.log("Function calcpercentage do")
            if ((diffnum - 4) * 100 / 26 > 100)
                return 100;
            else
                return (diffnum - 4) * 100 / 26;
        },
        calcpercentage2(percentage) {
            //console.log("Function calcpercentage2 do")
            value = 50 + (percentage - 50) * 4
            if (value <= 0)
                value = 0;
            else if (value >= 100)
                value = 100
            //console.log(value)
            return value;
        },
        getbestdorichart() {
            //console.log("Function getbestdorichart do")
            diffstr = ["easy","normal","hard","expert","special"]
            if (this.bestdoriid > 500) {
                url = "https://bird.ioliu.cn/v1?url=https://player.banground.fun/api/bestdori/community/" + this.bestdoriid;
            }
            else {
                url = "http://106.55.249.77/bdofftobdfan?id=" + this.bestdoriid + "&diff=" + diffstr[this.diffid]
            }
            flag = false;
            vm = this;
            this.loading = true;
            this.clearinput()
            this.$forceUpdate();
            axios.get(url).then(function (res) {
                if (res.status == 200) {
                    //console.log(res)
                    if (vm.bestdoriid > 500 && res.data.result) {
                        vm.inputstr = JSON.stringify(res.data.data.notes);
                        vm.diffid = res.data.data.difficulty;
                        vm.analysis(true)
                    }
                    else if (vm.bestdoriid <= 500 && res.data.result) {
                        vm.inputstr = JSON.stringify(res.data.data)
                        vm.analysis(true)
                    }
                    else {
                        vm.$message("谱面id输入错误")
                        vm.loading=false
                    }
                    vm.$forceUpdate();
                }
                else {
                    vm.$message("访问bestdori失败");
                    vm.loading=false
                }
            })
        },
        clearinput() {
            //console.log("Function clearinput do")
            this.inputstr = "";
            this.showdetail = false;
            this.npsdiff= null //根据nps计算的难度
            this.hpsdiff= null //根据hps计算的难度
            this.maxhpsdiff = null
            this.maxspddiff = null
            this.maxfpsfrontdiff = null
            this.maxfpsbackdiff = null
            this.leftpercent= null
            this.bpmlow= null // 最低的bpm
            this.bpmhigh= null // 最高的bpm
            this.totalflick= null // 粉键的个数
            this.maxhps= null // 最高的hps
            this.maxfpsfront= null // 最高的fps
            this.maxfpsback= null
            this.maxspd= null //最高的滑动速度
            this.totaltimemin= null // 总计的时间-分
            this.totaltimesec= null // 总计的时间-秒
            this.totalnote= null // 物量
            this.totalnps= null // nps
            this.totalhitnote= null // Hit数
            this.totalhps= null// hps
        },
        returncolor(per){
            barcolor =  [
                '#409EFF','#47A4DE','#4DAABD','#54B09D','#5AB67C',
                '#61BC5B','#67C23A','#80BC3A','#9AB53B','#B3AF3B',
                '#CDA83C','#E6A23C','#E89A43','#EA934A','#EC8B51',
                '#EF8357','#F17B5E','#F37465','#F56C6C','#F4667B',
                '#F2608A','#F15A99','#F053A8','#EF4DB7','#ED47C6','#EC41D5'
            ]
            num = Math.ceil(per * 0.26) - 1
            //console.log(num)
            if (num < 0)
                num = 0
            if (num > 25)
                num = 25 
            return barcolor[num]
        }
    }
}