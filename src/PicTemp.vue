<template>
  <div class="wrap" id="pic-template" v-cloak>
    <div class="wrapBox">
      <div class="wrapCon">
        <swiper  :auto-update="false" :options="swiperOptions" ref="swiperComponent">
          <swiper-slide v-for="(item,idx) in imgList"><img :src="item"></swiper-slide>
        </swiper>
      </div>
    </div>
    <div>
      <div id="scroll-id" v-cloak>
        <div class="wrapBox2">
          <div class="wrapTip">
            <marquee behavior="" direction="">
              <span v-for="(item,i) in tipData" class="wrapTipStyle" :style="{color: item.font_color}">{{item.content}}</span>
            </marquee>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PicTemp',
    data () {
      return {

        currentPic:0,
        tipData: [], //滚动信息
        dataList: [], //航班列表信息
        imgList: [], //图片列表信息
        imgArr: [], //图片列表信息
      }
    },
    computed: {
      swiper() {
        return this.$refs.swiperComponent.$swiper
      },
      swiperOptions(){
        const templateCode = this.code;
        return  {
          loop: true,
          loopedSlides:0,
          speed: 1000,
          init:false,
          keyboard: {
            enabled: true,
            pageUpDown: false,
          },
          on: {
            keyPress: function (event) {
              if (event == 13) {
                this.slideNext( 1000, false);//速度为1秒
                window.localStorage.setItem(templateCode, this.realIndex);
              }
            },
          },
          direction: 'vertical',
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      },
    },
    props: {
      code:String
    },
    created() {
      let self = this;
      self.initPage();
      window.onresize = function () {
        self.initPage();
      };
    },
    mounted() {
      let self = this;

      let value = window.localStorage.getItem(this.code);
      if (value) {
        self.currentPic =  parseInt(value);
      }

      this.swiperOptions.loopedSlides = this.imgList.length;
      this.$refs.swiperComponent.swiperInstance.init();
      this.swiper.slideToLoop(this.currentPic, 1, false);
    },
    methods : {
      initPage: function () {
        let self = this;
        self.loadData();
      },
      loadData: function () {
        let self = this;
        self.getPictureData();
        self.getScrollInfo();
      },
      getPictureData() {
        const self = this;
        const templateCode = this.code;

        //获取图片信息
        $.ajax({
          type: "GET",
          url: "../../../Data/baseData/equipmentInfo.json",
          async:false,
          dataType: "json",
          success: function (res) {//img_store_url
            if (res) {
              let array = res.filter(r => r.templateCode === templateCode);
              if (array.length > 0) {
                let imgList = array[0].imgListArray;
                if (imgList && imgList.length > 0) {
                  self.imgList = [];
                  $.each(imgList, function (idx, i) {
                    self.imgList.push("../../../" + i.img_store_url)
                    self.imgArr.push(i);
                  });
                }
              }
            }
          }
        });
      },
      getScrollInfo() {
        let self = this;

        //优先获取管理员发布的自定义滚动信息，若无，再取航显屏配置的滚动信息
        $.ajax({
          type: "GET",
          url: "../../../Data/baseData/customScrollInfo.json",
          async: false,
          dataType: "json",
          success: function (res) {
            let array = [];
            if (res && res.length > 0) {
              let nowTime = new Date().getTime();
              res.forEach(function (element) {
                if (element.startTime < nowTime && ((element.endTime + 20000) > nowTime)) {
                  array.push({
                    content: element.content,
                    font_color: element.font_color
                  });
                }
              });
            }
            if (array.length > 0) {
              if(JSON.stringify(array) !== JSON.stringify(self.tipData)){
                self.tipData = array;
              }
            }
            else {
              self.getEquipmentInfo();
            }
          },
          error: function (res) {
            self.getEquipmentInfo();
          }
        });
      },
      getEquipmentInfo() {
        let self = this;

        //获取滚动信息
        $.ajax({
          type: "GET",
          url: "../../../Data/baseData/equipmentInfo.json",
          async: false,
          dataType: "json",
          success: function (res) {
            if (res) {
              let array = res.filter(function (element) {
                return element.templateCode === self.code;
              });
              if (array.length > 0) {
                let scrollInfo = array[0].scrollInfoList;
                if (scrollInfo && JSON.stringify(scrollInfo) !== JSON.stringify(self.tipData)) {
                  self.tipData = array[0].scrollInfoList;
                }
              }
            }
          }
        });
      },
      getImgIndex(key){
        if(window && window.localStorage){
          return window.localStorage.getItem(key);
        }
        else {
          return 0;
        }
      },
      setImgIndex(key,value){
        if(window && window.localStorage){
          window.localStorage.setItem(key, value);
        }
      },
      showImage(id){
        var self = this;
        setTimeout(function (){
          self.imgArr.forEach(function (element,index) {
            if(element.id == id){
              self.setImgIndex(self.code, index.toString());
              self.swiper.slideToLoop(index, 1000, false);//速度为1秒
            }

          })
        },200)
      },
      showImageByIndex(idx){
        var self = this;
        setTimeout(function (){
          self.swiper.slideToLoop(idx, 1000, false);//速度为1秒
        },200)
      }
    }
  }
</script>

<style lang="css">
  .wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000;
    overflow: hidden;
  }

  .wrapBox {
    width: 100%;
    height: calc(100% - 5rem);
    padding: 10px 10px 0 10px;
  }

  .wrapBox2 {
    width: 100%;
    padding: 0 10px;
  }

  .wrapTip {
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    font-size: 2.8rem;
    color: #b23e61;
  }

  .wrapTipStyle {
    padding-right: 400px;
  }

  .wrapCon {
    width: 100%;
    height: 100%;
    background-color: #092ad9;
  }

  .marquee-content span {
    vertical-align: middle;
    font-size: 2.9rem;
    color: #fff;
  }

  .wrapCon img, .swiper-container {
    width: 100%;
    height: 100%;
  }
</style>
