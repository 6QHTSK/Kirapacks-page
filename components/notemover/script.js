module.exports = {
    data:function(){
        return {
            offset: 0,
            inputstr: "",
            outputstr: "",
            constoutput: ""
        }
    },
    methods:{
        outputchange(e){
            this.outputstr=this.constoutput;
        },
        fix(){
            try{
                inputjson=JSON.parse(this.inputstr);
            }
            catch(err){
                this.$message("谱面错误");
            }
            for(let note of inputjson){
                if("beat" in note && !(note["type"] == "System" && note["beat"] == 0) ){
                    note["beat"] = note["beat"]+this.offset;
                }
            }
            this.constoutput=JSON.stringify(inputjson);
            this.outputchange();
        }   
    }
}