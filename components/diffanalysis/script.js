//import Chart from "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js";
var lastdiffid=3;
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
            npsdiff: 25, //根据nps计算的难度
            hpsdiff: 25, //根据hps计算的难度
            totaldiff: 25.2, //综合全部计算的难度
            totalintdiff: 25, //totaldiff 取整
            totalstrdiff: "", // totaldiff 字符串化
            npsstrdiff: "", // npsdiff 字符串化
            hpsstrdiff: "", // hpsdiff 字符串化
            bpmlow: 10000000, // 最低的bpm
            bpmhigh: -1, // 最高的bpm
            showdetail: false, // 是否打开谱面分析栏
            totalflick: 0, // 粉键的个数
            maxhps: 0.0, // 最高的hps
            maxfps: 0.0, // 最高的fps
            maxslidespeed: 0.0, //最高的滑动速度
            totaltimemin: 0, // 总计的时间-分
            totaltimesec: 0, // 总计的时间-秒
            totalnote: 0, // 物量
            totalnps: 0, // nps
            totalhitnote: 0, // Hit数
            totalhps: 0,// hps
            marks: {
                0: {
                    style: {
                        color: '#409EFF'
                    },
                    label: 'Easy'
                },
                1: {
                    style: {
                        color: '#67C23A'
                    },
                    label: 'Normal'
                },
                2: {
                    style: {
                        color: '#E6A23C'
                    },
                    label: 'Hard'
                },
                3: {
                    style: {
                        color: '#F56C6C'
                    },
                    label: 'Expert'
                }
            },
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
        this.drawmap = new Chart(map, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "NPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(64,158,255)",
                    fill: false
                },
                {
                    label: "HPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(103,194,58)",
                    fill: false
                },
                {
                    label: "FPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(245,108,108)",
                    fill: false
                }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    methods: {
        getdiffcolor() {
            diffcolor = ["#409EFF", "#67C23A", "#E6A23C", "#F56C8C"];
            if(this.diffid != lastdiffid){
                this.analysis();
                lastdiffid = this.diffid;
            }
            return diffcolor[this.diffid];
        },
        drawchart(timelist, npslist, hpslist, fpslist) {
            var map = document.getElementById("map");
            this.drawmap.data.labels = timelist;
            this.drawmap.data.datasets[0].data = npslist;
            this.drawmap.data.datasets[1].data = hpslist;
            this.drawmap.data.datasets[2].data = fpslist;
            this.drawmap.update();
            this.$forceUpdate();
        },
        analysis() {
            if (this.inputstr != "" && transferJson(this, this.inputstr)) {
                this.totalflick = 0;
                this.maxslidespeed = 0.0;
                this.maxfps = 0;
                this.maxhps = 0;
                try {
                    information = details(this.chartjson,this.diffid,this.drawchart);
                    this.showdetail = true;
                    this.npsdiff = information.diffset.npsdiff;
                    this.npsstrdiff = information.diffset.npsstrdiff;
                    this.hpsdiff = information.diffset.hpsdiff;
                    this.hpsstrdiff = information.diffset.hpsstrdiff;
                    this.totaldiff = information.diffset.totaldiff;
                    this.totalintdiff = information.diffset.totalintdiff;
                    this.totalstrdiff = information.diffset.totalstrdiff;
                    this.totaltimemin = information.totaltimemin;
                    this.totaltimesec = information.totaltimesec;
                    this.totalnps = information.totalnps;
                    this.totalhps = information.totalhps;
                    this.totalnote = information.totalnote;
                    this.totalhitnote = information.totalhitnote;
                    this.totalflick = information.totalflick;
                    this.maxslidespeed = information.maxslidespeed;
                    this.maxhps = information.maxhps;
                    this.maxfps = information.maxfps;
                    this.bpmlow = information.bpmlow;
                    this.bpmhigh = information.bpmhigh;
                } catch (error) {
                    this.$message("分析过程错误 " + error);
                }
            }
        },
        inputchange(e) {
            this.$forceUpdate();
        },
        calcpercentage() {
            if ((this.totaldiff - 5) * 100 / 22 > 100)
                return 100;
            else
                return (this.totaldiff - 5) * 100 / 22;
        },
        getbestdorichart() {
            url = "https://bird.ioliu.cn/v1?url=https://player.banground.fun/api/bestdori/community/" + this.bestdoriid;
            flag = false;
            vm = this;
            this.loading = true;
            this.$forceUpdate();
            axios.get(url).then(function (res) {
                vm.loading = false;
                if (res.status == 200) {
                    //console.log(res)
                    if (res.data.result) {
                        vm.inputstr = JSON.stringify(res.data.data.notes);
                        vm.diffid = res.data.data.difficulty < 3 ? res.data.data.difficulty : 3;
                        vm.analysis()
                    }
                    else {
                        vm.$message("谱面id输入错误")
                    }
                    vm.$forceUpdate();
                }
                else {
                    vm.$message("访问bestdori失败");
                }
            })
        },
        changecolor() {
            element1 = document.getElementsByClassName("el-slider__bar")[0];
            element2 = document.getElementsByClassName("el-slider__button")[0];
            color = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'];
            element1.style.backgroundColor = color[this.diffid];
            element2.style.border = "2px solid " + color[this.diffid];
        },
        clearinput() {
            this.inputstr = "";
            this.showdetail = false;
        },
        showdiffrange() {
            diffrange = ["5~10", "11~15", "16~21", "22~26"];
            return diffrange[this.diffid];
        }
    }
}