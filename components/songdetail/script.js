module.exports = {
    props: ["item"],
    data: function () {
        return {
            SeeDetail: false,
            musictag: this.item.songname
        }
    },
    components:{
        'tags' : httpVueLoader('.\\components\\tags\\tags.vue'),
    },
    methods: {
        imgsrc(e) {
            return '.\\Songpic\\HD\\' + this.item.id + '.jpg'
        },
        detailcardtitle(e) {
            return this.item.artist + '-' + this.item.songname
        },
        cardestroy(e) {
            var player=document.getElementById(this.item.songname);
            player.pause();
            this.SeeDetail = false;
        },
        cardclick(e) {
            this.SeeDetail = true;
        },
        openbililink(e){
            this.SeeDetail = false;
            if(this.item.bilisrc==undefined)
            {
                alert("本曲目暂未上传到bilibili");
            }
            else
            {
                window.open(this.item.bilisrc, "_blank");
            }
        },
        openbdlink(e) {
            this.SeeDetail = false;
            this.SeeDetail = false;
            if(this.item.newid==undefined)
            {
                window.open('https://bestdori.com/community/charts/' + this.item.id, "_blank");
            }
            else
            {
                window.open('https://bestdori.com/community/charts/' + this.item.newid, "_blank");
            }
        },
        openpbbblink(e) {
            this.SeeDetail = false;
            if(this.item.bdsrc==undefined)
            {
                window.open('https://player.banground.fun/?id=' + this.item.id + '&type=community&autoload=true', "_blank")
            }
            else
            {
                window.open('https://player.banground.fun/?id=' + this.item.newid + '&type=community&autoload=true', "_blank")
            }
        },
        openkirapack(e) {
            this.SeeDetail = false;
            alert("暂不支持kirapack下载，请等待BG社区上线")
        },
        audiosrc(e){
            return ".\\song\\"+this.item.id+".mp3"
        },
        origin(e){
            return this.item.origin
        },
        songmeta(e){
            return[
                {
                    title:"BPM:\n"+ (this.item.bpm[0] == this.item.bpm[1]?this.item.bpm[0]:this.item.bpm[0]+"~"+this.item.bpm[1]),
                    easy:"EZ",
                    normal:"NM",
                    hard:"HD",
                    expert:"EX",
                    special:"SP",
                },
                {
                    title:"难度",
                    easy:this.item.diff[0] < 0 ? "-" : this.item.diff[0],
                    normal:this.item.diff[1] < 0 ? "-" : this.item.diff[1],
                    hard:this.item.diff[2] < 0 ? "-" : this.item.diff[2],
                    expert:this.item.diff[3] < 0 ? "-" : this.item.diff[3],
                    special:this.item.diff[4] < 0 ? "-" : this.item.diff[4],
                },
                {
                    title:"物量",
                    easy:this.item.note[0] < 0 ? "-" : this.item.note[0],
                    normal:this.item.note[1] < 0 ? "-" : this.item.note[1],
                    hard:this.item.note[2] < 0 ? "-" : this.item.note[2],
                    expert:this.item.note[3] < 0 ? "-" : this.item.note[3],
                    special:this.item.note[4] < 0 ? "-" : this.item.note[4],
                }
            ]
        }
    }
}