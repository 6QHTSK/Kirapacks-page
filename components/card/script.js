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
          return 'https://test-1300838857.cos.ap-singapore.myqcloud.com/WEBP/'+this.item.id+'.webp'
        },
        cardclick(e){
          this.$refs.songdetail.cardclick();
        },
    },
    components:{
      'songdetail' : httpVueLoader('.\\components\\songdetail\\songdetail.vue')
    }
  }