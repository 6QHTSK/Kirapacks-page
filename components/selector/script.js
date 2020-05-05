module.exports = {
    data: function () {
        return {
            sortkey: "id",
            sortmethod: -1,//1 升序 -1 降序
            SongType: ["Anime", "Game", "NoAG", "Video", "Script", "NoVS", "Finished", "Unfinished", "FULL", "Short", "HighDiff", "LowDiff"]
        }
    },
    watch: {
        sortkey(val) {
            this.$emit("changekey", val);
        },
        sortmethod(val) {
            this.$emit("changemethod", val);
        },
        SongType: {
            handler(val) {
                this.$emit("changetype", val);
            },
            deep: true
        }
    },
    methods: {
        setsortkey(name, e) {
            if (this.sortkey == name) {
                this.sortmethod = this.sortmethod * -1;
            }
            else {
                this.sortkey = name;
                this.sortmethod = -1;
            }
        },
        seticon(e) {
            return this.sortmethod > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
        },
    }
}