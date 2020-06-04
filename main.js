Vue.use(httpVueLoader);
var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      songlist: getsonglist()
    }
  },
  components: {
    'kirapack': 'url:.\\components\\kirapack\\kirapack.vue',
    'indexpage': 'url:.\\components\\index\\index.vue',
    'diffanalysis': 'url:.\\components\\diffanalysis\\diffanalysis.vue'
  },
  template: ``
});