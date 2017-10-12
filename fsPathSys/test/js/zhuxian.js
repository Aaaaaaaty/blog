function zhuxian() {
  if(!~window.location.hash.indexOf('realIndex')) {
    window.location.hash = 'indexUrl=-1&realIndex=0&prev=0&hash=0'
  }  
  var mySwiper = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    // 如果需要前进后退按钮
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    onClick: function() {
      var index = readUrlHash('realIndex')
      changeHash(2)
      window.location.hash = window.location.hash.replace('indexUrl=' + readUrlHash('indexUrl'), 'indexUrl=' + index)
      window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 2)
      window.location.reload()
    },
    onSlideChangeEnd: function(swiper){
      realIndex = swiper.realIndex //0段氏山庄1小池镇2云梦川
      var index = readUrlHash('realIndex')
      window.location.hash = window.location.hash.replace('realIndex=' + index, 'realIndex='+ realIndex)
      var index = '',
          top = 0,
          width = 0,
          margin = 0
      if(realIndex == 0) {
        index = 'duan'
        top = 3
        width = 3.37
        margin = 1.685
      }
      if(realIndex == 1) {
        index = 'xiao'
        top = 1
        width = 2.9
        margin = 1.45
      }
      if(realIndex == 2) {
        index = 'yun'
        top = -2
        width = 2.9
        margin = 1.45
      }
      $('.view-word').attr('src', './images/'+ index +'.png').css({
        'top': top+'%',
        'width': width + 'rem',
        'margin-left': '-' + margin + 'rem'
      })
      $('.view-des').attr('src', './images/'+ index +'-des.png')
    }
  }) 

  window.onload = function() {
    changeHash(0)
  }
    var hash = window.location.hash.split('&'),
        hashLength = hash.length,
        realIndex = 0,
        wrapper = $('.wrapper'),
        zhuxian = $('.zhuxian'),
        view = $('.view'),
        des = $('.des'),
        eye = $('.eye'),
        bg = $('.bg.zhuxian-bg'),
        mengSec = $('.meng-sec'),
        btn360 = $('.view-btn'),
        hands = $('.hands'),
        back360 = $('.back360'),
        homeDes = $('.home-des'),
        tipClose = $('.tip-close'),
        wrapperSwiper = $('.wrapper-swiper')
    $('.button-swiper-prev').click(function() {
      mySwiper.slidePrev()
    })
    $('.button-swiper-next').click(function() {
      mySwiper.slideNext()
    })
    var readHash = function() { //读最后一位hash
          return window.location.hash.split('&')[window.location.hash.split('&').length-1]
        }
    var hashChangeDom = function(hash) {
      if(hash == 0) {
        des.attr('src', './images/description.png').show()
        bg.attr('src', './images/bg.jpg').show()
        zhuxian.show()
        wrapper.show()
        wrapperSwiper.hide()
        back360.hide()
        mengSec.hide()
        hands.hide()
      } else if(hash == 1) {
        des.attr('src', './images/back.png').show()
        bg.hide()
        wrapper.hide()
        hands.hide()
        back360.hide()
        mengSec.show()
        zhuxian.show()
        wrapperSwiper.show()
        changeHash(0)
      } else if(hash == 2) {
        des.attr('src', './images/back.png').show()
        hands.show()
        back360.show()
        zhuxian.hide()       
        entry(hands)
      }
    }
    var changeHash = function(num) {
      window.location.hash = window.location.hash.replace('hash=' + readUrlHash('hash'), 'hash='+ num)
    }
    var changeUrl = function(url) {
      var splitHash = window.location.hash.slice(1).split('&')
      var url360 = ''
      splitHash.forEach(function(item) {
        if(~item.indexOf('360url')) {
          url360 = item.slice(7)
        }
      })
      window.location.hash = window.location.hash.replace(url360, url)
    }
    if(hash[hashLength-1].split('=')[0] !== 'hash') {
      window.location.hash = window.location.hash + '&hash=0'
    }
    var hash = readUrlHash('hash') //0首页 1景点 2全景
    hashChangeDom(hash)
    view.click(function() {
      changeHash(1)
      hashChangeDom(readUrlHash('hash'))
      window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 1)
    })
    des.click(function() {
      console.log(123)
      if(readUrlHash('prev') == 0 ) {
        homeDes.show()
      } else {
        var prev = readUrlHash('prev') - 1
        hashChangeDom(prev)
        window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + prev)
      }
    })
    btn360.click(function() {
      var index = readUrlHash('realIndex')
      changeHash(2)
      window.location.hash = window.location.hash.replace('indexUrl=' + readUrlHash('indexUrl'), 'indexUrl=' + index)
      window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 2)
      window.location.reload()
    }) 
    eye.click(function() {
      changeHash(2)
      hashChangeDom(readUrlHash('hash'))
      window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 0)
      window.location.hash = window.location.hash.replace('indexUrl=' + readUrlHash('indexUrl'), 'indexUrl=-1')
      window.location.reload()
    })
    back360.click(function() {
      if(readUrlHash('prev') == 0) {
        hashChangeDom(0)
        window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 0)
      } else {
        hashChangeDom(1)
        window.location.hash = window.location.hash.replace('prev=' + readUrlHash('prev'), 'prev=' + 1)
      }
      $('canvas').remove()
      
      var index = readUrlHash('realIndex')
      mySwiper.slideTo(index, 0)
    })
    tipClose.click(function() {
      homeDes.hide()
    })     


}
