
module.export={
    data:function(){
        return {
            
        }
    },
    mounted(){
        var sUserAgent = navigator.userAgent;
        //print(sUserAgent)
        if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
            location.href = 'http://coppercomplex.gitee.io/mobile/index.html';
        }
    }
}