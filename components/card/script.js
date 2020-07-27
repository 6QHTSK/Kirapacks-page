module.exports = {
    props:["item"],
    data: function(){
        return{
            diffname: ["easy", "normal", "hard", "expert", "special"],
            SeeDetail:false,
        }
    },
    methods: {
        imgsrc(e){
          return 'https://assets-1300838857.cos.ap-nanjing.myqcloud.com/pic/'+this.item.id+'.jpg/webp'
        },
        cardclick(e){
          this.$refs.songdetail.cardclick();
        },
    },
    components:{
      'songdetail' : httpVueLoader('.\\components\\songdetail\\songdetail.vue')
    }
  }