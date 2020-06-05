Vue.use(httpVueLoader);
function getQueryString(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}
var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      songlist: getsonglist(),
      activename : "A"
    }
  },
  components: {
    'kirapack': 'url:.\\components\\kirapack\\kirapack.vue',
    'indexpage': 'url:.\\components\\index\\index.vue',
    'diffanalysis': 'url:.\\components\\diffanalysis\\diffanalysis.vue'
  },
  mounted(){
    if(getQueryString("id")!=false){
      this.activename = "C";
    }
  },
  template: ``
});