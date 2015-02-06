define([
  'butterfly/view',
  'butterfly/listview/ListView',
  'butterfly/listview/DataSource',
  "butterfly/notification",
  "jquery",
  'css!com.foreveross.chameleon.exhibition.news/index'],
  function(View,ListView,DataSource,Notification,$){

  return View.extend({

    events:{
    	'click .tab-item':'tabChange',
      "click a[data-action='back']": "goBack"
    },

    currentTab:null,

    dsLoaded:{
      "recommend":false,
      "announcement":false,
      "jobs":false,
    },

    initialize:function(){
    	console.log("News.initialize...");
    },
    render:function(){
      console.log("News.render...");
      if (!this.currentTab) {
          this.currentTab="recommend";
      }
      this._initListView(this.currentTab);
    },
    onShow:function(){
      console.log("News.onShow");
    },

    _initListView:function(type){
      var list = "listview_" + type;
      var data = "datasource_" + type;
      var listEl=this.el.querySelector("#"+type);
      var template = _.template(this.$("#news_listTemplate").html());

      // var dsOptions = ['identifier', 'url', 'requestParams', 'pageParam', 'pageSizeParam', 'startParam', 'countParam', 'storage'];
      this[data]= new DataSource({
        storage : "local",
        identifier : type +".ds",
        url : "../com.foreveross.chameleon.exhibition.news/"+type+".json",
        requestParams : {}
      });

      // var options = ['id', 'autoLoad' ,'itemTemplate', 'itemClass', 'dataSource', 'pageSize'];
      this[list]= new ListView({
        id: type + ".lv",
        el: listEl,
        itemTemplate:template,
        dataSource:this[data]
      });
      this.dsLoaded[type]=true;
      this.listenTo(this[list],"itemSelect",this.onItemSelect);
    },

    onItemSelect:function(listview,item,index,event) {
      var itemID=item.$(".listitem").attr("data-id");
      var me=this;
      console.log("itemID-->>"+itemID);
      me.getContent(itemID,function(data){
        // console.log(typeof data);
        // me.getData(itemID);
        window.butterfly.navigate("com.foreveross.chameleon.exhibition.news/detail.html?id="+itemID);
      }, function(){
        Notification.show({
          type: "error",
          message: '数据获取失败',
        });
      });
    },

    getContent:function(id,success, fail){
        var me=this;
        var detail="detail_"+id;
        var cache = window.localStorage[detail];
        if(!cache){
          $.ajax({
            type:"GET",
            url:"../com.foreveross.chameleon.exhibition.news/"+me.currentTab+"_detail.json",
            dataType:"json",
            timeout:5000,
            success:function(jsons){
              if (jsons) {
                var json=_.find(jsons,function(obj){
                  return obj.id==id;
                });
                if (json) {
                  window.localStorage[detail]=JSON.stringify(json);
                  success(json);
                }else{
                  fail();
                }
              }else{
                fail();
              }
            },
            error:function(xhr, status, obj){
              console.log("信息读取失败");
              fail();
            }
          });
        } else {
          success(JSON.parse(cache));
        }
    },
    // getData:function(itemID){
    //   var me=this;
    //   var localstorage = window.localStorage[me.currentTab+'_detail'];
    //   var cache=JSON.parse(localstorage);
    //   var jsonobj=_.find(cache,function(obj){
    //     return obj.id==itemID;
    //   });
    //   if (jsonobj) {
    //     window.localStorage["detail_"+itemID]=JSON.stringify(jsonobj);
    //     return true;
    //   }else{
    //     console.log("读取ID:"+itemID+"详情失败");
    //     // me.$(".message .error").show();
    //     // me.$(".message").show();
    //      Notification.show({
    //         type: "error",
    //         message: '详情数据获取失败',
    //      });
    //     return false;
    //   }
    // },

    tabChange:function(e){
      var me=this;
      var el=e.currentTarget;
      var currentTab=$(el).attr("state");
      var hadExtend = false;
      $("#strip").animate({
        left:$(el).offset().left,
        // width:$(el).width()
      },"fast");

      me.$(".tab-item.active").removeClass("active");
      $(el).addClass("active");

      me.$(".newslist.active").removeClass("active");
      me.$('#'+currentTab+'List').addClass("active");

      console.log( new Date().format('h:mm:ss:S') + "..."+"currentTab-->>"+currentTab);

      var message=$('#'+currentTab).find('.message');
      var error=$('#'+currentTab).find('.error');
      if(message.hasClass('visible') && error.hasClass('visible')){
        hadExtend = true;
      }

      if (!me.dsLoaded[currentTab]) {
        me._initListView(currentTab);
      }else{
        if (hadExtend === true) {
            var list ="listview_"+currentTab;
            me[list].reloadData();
        }
      }
      this.currentTab=currentTab;
    },

    goBack: function(){
      window.history.back();
    }
  });
});
