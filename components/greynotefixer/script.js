module.exports = {
    data:function(){
        return {
            accuracystr: "12",
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
            if(this.accuracystr=="12"){
                accuracy = 12;
            }
            else if(this.accuracystr == "24"){
                accuracy = 24;
            }
            else if(this.accuracystr == "4"){
                accuracy = 4;
            }
            else{
                accuracy = 48;
            }
            console.log(this.accuracystr);
            for(let note of inputjson){
                if("beat" in note){
                    note["beat"] = Math.round(note["beat"]*accuracy)/accuracy;
                }
            }
            this.constoutput=JSON.stringify(inputjson);
            this.outputchange();
        }   
    }
}