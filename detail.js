define(['butterfly/view','iscroll','css!com.foreveross.chameleon.exhibition.news/detail'], function(View,IScroll){

  return View.extend({
    events: {
      "click a[data-action='back']": "goBack"
    },

    id:0,

    initialize:function(){
    	console.log("detail_初始化");
    	this.id=this.getUrlVar("id");
    	console.log(this.id);
    },

    onShow:function(){
    	console.log("detail_onShow");
    	var detail=this.loadData(this.id);
    	console.log(detail);
    	this.$(".contTitle h1").html(detail.title);
    	this.$(".contTitle .time").html(detail.releaseTime);
    	this.$(".news_detail").html(detail.body);
        var imgs=this.$("img");
        imgs.parents("p").css({
            "text-indent":"0pt",
        });
        // this.IScroll = new IScroll("scroller", {
        //         scrollX: false,
        //     scrollY: true,
        //     mouseWheel: true
        //     });

    },

    render:function(){
    	console.log("detail_render");
    },
    loadData:function(id){
    	var me=this;
    	var localstorage = window.localStorage["detail_"+id];
    	var jsonobj=JSON.parse(localstorage);
    	return jsonobj;
    },

    getUrlVars: function(){
    var vars = [], hash;
    href=window.location.href;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  	},
	getUrlVar: function(name){
	    return this.getUrlVars()[name];
	},
	goBack: function(){
      window.history.back();
    },
});
});