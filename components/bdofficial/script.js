module.exports = {
    data: function () {
        return {
            bestdoriid: 1,
            diff: "expert",
            outputstr: "",
            constoutput: "",
            onloading : false
        }
    },
    methods: {
        outputchange(e) {
            this.outputstr = this.constoutput;
        },
        pullbdchart() {
            this.onloading = true
            vm = this
            url = "https://bird.ioliu.cn/v1?url=http://106.55.249.77/bdofftobdfan?id=" + this.bestdoriid + "&diff=" + this.diff;
            axios.get(url).then(function (res) {
                vm.onloading = false;
                if (res.status == 200) {
                    if (res.data.result) {
                        vm.constoutput = JSON.stringify(res.data.data);
                        vm.outputchange();
                    }
                    else {
                        vm.$message("谱面id/难度输入错误")
                    }
                }
                else {
                    vm.$message("拉取资源失败")
                }
            }
            )
        }
    }
}