module.exports={
    props:["item"],
    data:function(){
        return {

        }
    },
    components:{
        'songdetail' : httpVueLoader('.\\components\\songdetail\\songdetail.vue')
    },
    methods:{
        cardclick(e){
            this.$refs.songdetail.cardclick();
        },
    }
}