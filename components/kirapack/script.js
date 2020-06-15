function search(song,searchtext){
    searchtext = searchtext.toLowerCase()
    if(song.songname.toLowerCase().indexOf(searchtext) >= 0){
        return true;
    }
    for(let tag of song.tags){
        if(tag.toLowerCase().indexOf(searchtext) >= 0){
            return true;
        }
    }
    for(let d of song.diff){
        if(d.toLowerCase().indexOf(searchtext)>=0){
            return true;
        }
    }
    return false;
}
module.exports = {
    props: ["songlist"],
    data: function () {
        return {
            sortkey: "id",
            windowwidth: '',
            flitersong: [],
            col: 0,
            row: 1,
            islist: false,
            searchtext : "",
            sortmethod: -1,//1 升序 -1 降序
            diffname: ["easy", "normal", "hard", "expert", "special"],
            SongType: ["Anime", "Game", "NoAG", "Video", "Script", "NoVS", "Finished", "Unfinished", "FULL", "Short", "HighDiff", "LowDiff"]
        }
    },
    components: {
        'songCard': httpVueLoader('.\\components\\card\\card.vue'),
        'selector': httpVueLoader('.\\components\\selector\\selector.vue'),
        'list': httpVueLoader('.\\components\\list\\list.vue')
    },
    methods: {
        changekey(p) {
            this.sortkey = p;
            this.flitersong = this.fliter(this.songlist)
        },
        changemethod(p) {
            this.sortmethod = p;
            this.flitersong = this.fliter(this.songlist)
        },
        changetype(p) {
            this.SongType = p;
            this.flitersong = this.fliter(this.songlist)
        },
        searchsong(){
            this.flitersong = this.fliter(this.songlist)
        },
        spannumber(){
            return 24/this.colnumber();
        },
        fliter(songlist) {
            const { sortkey, sortmethod } = this;
            let fsong = [];
            for (let p of songlist) {
                tags = this.SongType;
                finish = p.diff[0] != "-1" && p.diff[1] != "-1" && p.diff[2] != "-1";
                full = p.time >= 160;
                highdiff = p.maxdiff >= 28;
                if (tags.includes("Anime") && p.tags[0] == "Anime" || tags.includes("Game") && p.tags[0] == "Game" || tags.includes("NoAG") && p.tags[0] == "Other") {
                    if (tags.includes("Video") && p.video || tags.includes("Script") && p.script || tags.includes("NoVS") && !(p.video || p.script)) {
                        if (tags.includes("Finished") && finish || tags.includes("Unfinished") && !finish) {
                            if (tags.includes("FULL") && full || tags.includes("Short") && !full) {
                                if (tags.includes("HighDiff") && highdiff || tags.includes("LowDiff") && !highdiff) {
                                    if(this.searchtext == "" || search(p,this.searchtext)){
                                        fsong.push(p);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            fsong.sort(function (p1, p2) {
                if (sortkey == 'songname') {
                    return p1.songname < p2.songname ? -1 * sortmethod : 1 * sortmethod;
                }
                else if (sortkey == 'bpm') {
                    return (p1.bpm[1] - p2.bpm[1]) * sortmethod;
                }
                else {
                    return (p1[sortkey] - p2[sortkey]) * sortmethod;
                }
            });
            return fsong;
        },
        listlength(){
            return this.flitersong.length;
        },
        colnumber(){
            if (this.windowwidth >=1580){
                this.col = 4;
                this.row = Math.ceil(this.flitersong.length/4);
                return 4;
            }
            else if(this.windowwidth >= 1160){
                this.col = 3;
                this.row = Math.ceil(this.flitersong.length/3);
                return 3;
            }
            else if(this.windowwidth >= 840){
                this.col = 2;
                this.row = Math.ceil(this.flitersong.length/2);
                return 2;
            }
            else{
                this.col = 1;
                this.row = this.flitersong.length;
                return 1;
            }
        },
        inputchange(e) {
            this.$forceUpdate();
        }
    },
    computed: {
    },
    mounted() {
        this.windowwidth = document.body.clientWidth;
        this.flitersong = this.fliter(this.songlist);
        this.colnumber();
        window.onresize = () => {
            return (() => {
                this.windowwidth = document.body.clientWidth;
                this.colnumber();
            })();
        };
    }
}