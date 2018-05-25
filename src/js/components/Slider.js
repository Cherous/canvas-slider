import { TweenMax } from 'gsap'

export default class Slider {
  
  constructor (containerClass, options) {
    
    // check object assign support
    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign (target, varArgs) {
          'use strict'
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object')
          }
          
          let to = Object(target)
          
          for (let index = 1; index < arguments.length; index++) {
            let nextSource = arguments[index]
            
            if (nextSource != null) {
              for (let nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey]
                }
              }
            }
          }
          return to
        },
        writable: true,
        configurable: true
      })
    }
    
    // set default options
    const defaults = {
      linesColor: 'rgba(120,120,120,0.5)',
      smallLineColor: 'rgba(56,177,56,0.8)',
      smallLineInertia: 15,
      slideNumberSeparatorColor: 'rgba(255,255,255,0.8)',
      slideNumberColor: 'rgba(56,177,56,0.8)',
      slideNumberFontSize: '26',
      slideNumberFontFamily: 'RobotoLight',
      rightText: 'S C R O L L  D O W N',
      rightTextFontSize: '12',
      rightTextFontFamily: 'Gilroy',
      rightTextOffsetLeft: '95',
      rightTextOffsetTop: '93',
      rightTextAlign: 'right',
      overlayFirstColor: '#000',
      overlaySecondColor: '#000',
      overlayOpacity: 0.5,
      showNav: true,
      autoPlaySpeed: 4000,
      animationSpeed: 3,
      firstAnimationSpeed: 3
    }
    const populated = Object.assign(defaults, options)
    for (const key in populated) {
      if (populated.hasOwnProperty(key)) {
        this[key] = populated[key]
      }
    }
    // create and append canvas into container
    this.class = containerClass
    this.container = document.querySelector(containerClass)
    this.canvas = {}
    this.canvas.elem = document.createElement('canvas')
    // check retina display
    window.devicePixelRatio > 1 ? this.initRetinaDisplay() : this.initDefaultDisplay()
    
    // get all img in slider
    this.images = this.container.getAttribute('data-images').split(',')
    // remove spaces
    for (let i = 0; i < this.images.length; i++) {
      this.images[i] = this.images[i].trim()
    }
    
    if (!this.images.length) return
    
    // set first and next slides to show
    this.sliderCounter = 1
    this.imageSrcCurrentSlide = this.images[0]
    this.imageSrcNextSlide = this.images[1]
    this.stopAutoplay = false
    // overlay gradient
    this.grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0)
    this.grd.addColorStop(0, this.overlayFirstColor)
    this.grd.addColorStop(1, this.overlaySecondColor)
    
    // params
    this.navDots = []
    this.interval = false
    // y = a*x
    this.angle = ( -(this.canvas.height ) / (this.canvas.width) )
    this.startShapePosition = {
      X: -50,
      Y: -50
    }
    
    this.offsetMove = {
      value: this.canvas.height / 2
    }
    
    this.xoff = {
      value: 0
    }
    this.xoffStart = {
      value: 0
    }
    this.arrowMove = {
      value: -150
    }
    this.startGlobalAlpha = {
      value: 0
    }
    this.globalAlpha = {
      value: 1
    }
    this.textGlobalAlpha = {
      value: 0
    }
    this.numberAlpha = {
      value: 0
    }
    
    this.tl = new TimelineMax({paused: true});
    this.tlDots = new TimelineMax();
    this.tlArrowText = new TimelineMax();
    this.tlStart = new TimelineMax();
    this.tlNumber = new TimelineMax();
    
    this.lines = [
      {
        moveX: 0.3,
        moveY: 0,
        x: 0,
        y: 0.3,
        inertia: 0.7
      },
      {
        moveX: 0.53,
        moveY: 0,
        x: 0,
        y: 0.53,
        inertia: 0.9
      },
      {
        moveX: 0.76,
        moveY: 0,
        x: 0,
        y: 0.76,
        inertia: 0.1
      },
      {
        moveX: 1,
        moveY: 0.23,
        x: 0.23,
        y: 1,
        inertia: 0.6
      },
      {
        moveX: 1,
        moveY: 0.46,
        x: 0.46,
        y: 1,
        inertia: 0.8
      },
      {
        moveX: 1,
        moveY: 0.7,
        x: 0.7,
        y: 1,
        inertia: 0.76
      },
      {
        moveX: 1,
        moveY: 0,
        x: 0,
        y: 1,
        inertia: 2.5
      }
    ];
      this.shapes = [
        {
          moveX: 0,
          moveY: 0,
          x1: 0.3,
          y1: 0,
          x2: 0,
          y2: 0.3,
          x3: 0,
          y3: 0,
          inertia: -this.getRandom(5, 15)
        },
        {
          moveX: 0.3,
          moveY: 0,
          x1: 0.53,
          y1: 0,
          x2: 0,
          y2: 0.53,
          x3: 0,
          y3: 0.3,
          inertia: this.getRandom(7, 9)
        },
        {
          moveX: 0.53,
          moveY: 0,
          x1: 0.76,
          y1: 0,
          x2: 0,
          y2: 0.76,
          x3: 0,
          y3: 0.53,
          inertia: -this.getRandom(2, 6)
        },
        {
          moveX: 0.76,
          moveY: 0,
          x1: 1,
          y1: 0,
          x2: 0,
          y2: 1,
          x3: 0,
          y3: 0.76,
          inertia: this.getRandom(2, 4)
        },
        {
          moveX: 1,
          moveY: 0,
          x1: 1,
          y1: 0.23,
          x2: 0.23,
          y2: 1,
          x3: 0,
          y3: 1,
          inertia: -this.getRandom(3, 7)
        },
        {
          moveX: 1,
          moveY: 0.23,
          x1: 1,
          y1: 0.46,
          x2: 0.46,
          y2: 1,
          x3: 0.23,
          y3: 1,
          inertia: this.getRandom(2, 3)
        },
        {
          moveX: 1,
          moveY: 0.46,
          x1: 1,
          y1: 0.7,
          x2: 0.7,
          y2: 1,
          x3: 0.46,
          y3: 1,
          inertia: -this.getRandom(2, 7)
        },
        {
          moveX: 1,
          moveY: 0.7,
          x1: 1,
          y1: 1,
          x2: 1,
          y2: 1,
          x3: 0.7,
          y3: 1,
          inertia: this.getRandom(5, 15)
        }
      ];
      this.onResize()
    this.init()
  }
  
  init () {
    this.initLoad()
  }
  
  getRandom (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  
  initLoad () {
    
    let _that = this
    
    this.nextSlide = new Image()
    this.nextSlide.src = this.imageSrcNextSlide
    
    this.currentSlide = new Image()
    this.currentSlide.src = this.imageSrcCurrentSlide
    
    let a = _that.angle
    
    let drawFirstShapes = function () {
      
      _that.ctx.globalAlpha = _that.startGlobalAlpha.value
      _that.ctx.clearRect(0, 0, _that.canvas.width, _that.canvas.height)
      for (let i = 0; i < _that.shapes.length; i++) {
        
        _that.ctx.save()
        _that.ctx.beginPath()
        _that.ctx.moveTo(_that.canvas.width * _that.shapes[i].moveX, _that.canvas.height * _that.shapes[i].moveY)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x1, _that.canvas.height * _that.shapes[i].y1)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x2, _that.canvas.height * _that.shapes[i].y2)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x3, _that.canvas.height * _that.shapes[i].y3)
        _that.ctx.closePath()
        _that.ctx.clip()
        _that.drawImageProp(_that.ctx, _that.currentSlide, _that.xoff.value * _that.shapes[i].inertia - 150, a * _that.xoff.value * _that.shapes[i].inertia - 150, _that.canvas.width + 150, _that.canvas.height + 150, 0, 0)
        _that.ctx.restore()
      }
      // add overlay
      _that.ctx.save()
      _that.ctx.globalAlpha = _that.startGlobalAlpha.value * _that.overlayOpacity
      _that.ctx.rect(0, 0, _that.canvas.width, _that.canvas.height)
      
      _that.ctx.fillStyle = _that.grd
      
      _that.ctx.fill()
      _that.ctx.restore()
      _that.drawLines()
      
      _that.ctx.save()
      _that.ctx.globalAlpha = _that.startGlobalAlpha.value
      _that.ctx.fillStyle = _that.slideNumberColor
      _that.ctx.font = `${_that.slideNumberFontSize}px ${_that.slideNumberFontFamily}`
      _that.ctx.fillText(`01`, _that.canvas.width * 0.046875, _that.canvas.height * 0.90)
      _that.ctx.restore()
      
    }
    this.tlStart
      .to(_that.startGlobalAlpha, _that.firstAnimationSpeed, {
        value: 1,
        ease: Power2.easeInOut,
        onUpdate: function () {
          drawFirstShapes()
        }
      }).addCallback(function () {
      if (_that.showNav) _that.drawDots()
      if (!_that.interval) {
        _that.interval = setInterval(() => {
          _that.changeImg()
        }, _that.autoPlaySpeed)
      }
      // setTimeout( function() {
      //   _that.render()
      //   _that.drawSlideNumber()
      // }, _that.autoPlaySpeed)
      
    })
    
  }
  
  drawDots () {
    // let _that = this
    this.$dotsContainer = document.createElement('ul')
    this.$dotsContainer.classList.add('navContainer')
    for (let i = 0; i < this.images.length; i++) {
      this.$dotsLi = document.createElement('li')
      this.$dotsLink = document.createElement('a')
      this.$dotsLink.setAttribute('href', '#')
      this.$dotsLink.classList.add('navLink')
      this.$dotsLi.classList.add('navItem')
      this.$dotsLi.appendChild(this.$dotsLink)
      this.navDots.push(this.$dotsLi)
      this.container.appendChild(this.$dotsContainer)
      this.$dotsContainer.classList.add('navContainer')
      this.$dotsContainer.appendChild(this.$dotsLi)
    }
    this.navDots[0].classList.add('active')
    this.initDotsEvent()
  }
  
  drawLines () {
    let _that = this
    for (let i = 0; i < _that.lines.length; i++) {
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width * _that.lines[i].moveX, _that.canvas.height * _that.lines[i].moveY)
      _that.ctx.lineTo(_that.canvas.width * _that.lines[i].x, _that.canvas.height * _that.lines[i].y)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = _that.linesColor
      _that.ctx.fillStyle = _that.linesColor
      _that.ctx.stroke()
    }
    this.drawLinesDots()
    this.drawNumberLine()
    this.drawArrowText()
  }
  
  drawLinesDots () {
    let _that = this
    // _that.ctx.globalAlpha = 1;
    for (let i = 0; i < _that.lines.length; i++) {
      _that.ctx.beginPath()
      _that.ctx.moveTo(this.canvas.width * _that.lines[i].moveX - this.offsetMove.value * _that.lines[i].inertia, this.canvas.height * _that.lines[i].moveY - this.offsetMove.value * this.angle * _that.lines[i].inertia)
      _that.ctx.lineTo(this.canvas.width * _that.lines[i].moveX - this.offsetMove.value * _that.lines[i].inertia - 15, this.canvas.height * _that.lines[i].moveY - this.offsetMove.value * this.angle * _that.lines[i].inertia - 15 * this.angle)
      _that.ctx.lineWidth = 4
      _that.ctx.strokeStyle = _that.smallLineColor
      _that.ctx.fillStyle = _that.smallLineColor
      _that.ctx.stroke()
    }
  }
  
  drawNumberLine () {
    let _that = this
    _that.ctx.beginPath()
    _that.ctx.moveTo(0 + _that.canvas.width * 0.06875, _that.canvas.height + _that.canvas.width * 0.06875 * this.angle)
    _that.ctx.lineTo(_that.canvas.width * 0.1175 - 15, this.canvas.height + _that.canvas.width * 0.1175 * this.angle - 15 * this.angle)
    _that.ctx.lineWidth = 1
    _that.ctx.strokeStyle = _that.slideNumberSeparatorColor
    _that.ctx.fillStyle = _that.slideNumberSeparatorColor
    _that.ctx.stroke()
  }
  
  drawArrowText () {
    let _that = this
    if (window.innerWidth > 1200) {
      //line main
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value - 40, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle - 40 * _that.angle)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      // line top
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value - 40, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle - 40 * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value - 35, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 6)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      // line bottom
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value - 40, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle - 40 * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value - 24, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 27)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      
      //text
      _that.ctx.save()
      _that.ctx.globalAlpha = _that.textGlobalAlpha.value
      _that.ctx.fillStyle = 'rgba(255,255,255,0.8)'
      _that.ctx.textAlign = _that.rightTextAlign
      _that.ctx.font = `${_that.rightTextFontSize}px ${_that.rightTextFontFamily}`
      _that.ctx.fillText(`${_that.rightText}`, _that.canvas.width * _that.rightTextOffsetLeft / 100, _that.canvas.height * _that.rightTextOffsetTop / 100)
      _that.ctx.restore()
      
      _that.tlArrowText
        .to(this.arrowMove, 3, {
          delay: 1,
          value: _that.canvas.height * 0.3,
          ease: Power4.easeOut
        })
        .to(this.textGlobalAlpha, 3, {
          value: 1,
          ease: Power4.easeInOut
        }, '-=3')
    } else {
      //line main
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value + 30, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 30 * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value + 10, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 10 * _that.angle)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      // line top
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value + 10, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 10 * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value + 5, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle - 30)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      // line bottom
      _that.ctx.beginPath()
      _that.ctx.moveTo(_that.canvas.width - _that.arrowMove.value + 10, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle + 10 * _that.angle)
      _that.ctx.lineTo(_that.canvas.width - _that.arrowMove.value + 28, _that.canvas.height * 0.7 - _that.arrowMove.value * _that.angle - 20)
      _that.ctx.lineWidth = 1
      _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.fillStyle = 'rgba(255,255,255,0.7)'
      _that.ctx.stroke()
      
      //text
      _that.ctx.save()
      _that.ctx.globalAlpha = _that.textGlobalAlpha.value
      _that.ctx.fillStyle = 'rgba(255,255,255,0.8)'
      _that.ctx.textAlign = _that.rightTextAlign
      _that.ctx.font = `${_that.rightTextFontSize}px ${_that.rightTextFontFamily}`
      _that.ctx.fillText(`${_that.rightText}`, _that.canvas.width * _that.rightTextOffsetLeft / 100, _that.canvas.height * _that.rightTextOffsetTop / 100)
      _that.ctx.restore()
      
      _that.tlArrowText
        .to(this.arrowMove, 3, {
          delay: 1,
          value: _that.canvas.height * 0.13,
          ease: Power4.easeOut
        })
        .to(this.textGlobalAlpha, 3, {
          value: 1,
          ease: Power4.easeInOut
        }, '-=3')
    }
    
  }
  
  cutShape () {
    
    let _that = this
    this.nextSlide = new Image()
    this.nextSlide.src = this.imageSrcNextSlide
    
    this.currentSlide = new Image()
    this.currentSlide.src = this.imageSrcCurrentSlide
    
    let a = _that.angle
    
    _that.currentSlide.onload = function () {
      
      
      // back image
      _that.ctx.clearRect(0, 0, _that.canvas.width, _that.canvas.height)
      _that.ctx.save()
      _that.drawImageProp(_that.ctx, _that.nextSlide, -150, -150, _that.canvas.width + 150, _that.canvas.height + 150, 0, 0)
      _that.ctx.restore()
      
      for (let i = 0; i < _that.shapes.length; i++) {
        _that.ctx.save()
        _that.ctx.globalAlpha = _that.globalAlpha.value
        // _that.ctx.filter = 'brightness(0.5)';
        _that.ctx.beginPath()
        _that.ctx.moveTo(_that.canvas.width * _that.shapes[i].moveX, _that.canvas.height * _that.shapes[i].moveY)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x1, _that.canvas.height * _that.shapes[i].y1)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x2, _that.canvas.height * _that.shapes[i].y2)
        _that.ctx.lineTo(_that.canvas.width * _that.shapes[i].x3, _that.canvas.height * _that.shapes[i].y3)
        _that.ctx.closePath()
        _that.ctx.clip()
        _that.drawImageProp(_that.ctx, _that.currentSlide, _that.xoff.value * _that.shapes[i].inertia - 150, a * _that.xoff.value * _that.shapes[i].inertia - 150, _that.canvas.width + 150, _that.canvas.height + 150, 0, 0)
        _that.ctx.restore()
      }
      // add overlay
      _that.ctx.save()
      _that.ctx.globalAlpha = _that.overlayOpacity
      _that.ctx.rect(0, 0, _that.canvas.width, _that.canvas.height)
      _that.ctx.fillStyle = _that.grd
      _that.ctx.fill()
      _that.ctx.restore()
      _that.drawLines()
      _that.drawSlideNumber()
    }
    
  }
  
  // cover img in canvas (for responsive)
  drawImageProp (ctx, img, x, y, w, h, offsetX, offsetY) {
    
    if (arguments.length === 2) {
      x = y = 0
      w = ctx.canvas.width
      h = ctx.canvas.height
    }
    
    // default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5
    
    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0
    if (offsetY < 0) offsetY = 0
    if (offsetX > 1) offsetX = 1
    if (offsetY > 1) offsetY = 1
    
    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   // new prop. width
      nh = ih * r,   // new prop. height
      cx, cy, cw, ch, ar = 1
    
    // decide which gap to fill
    if (nw < w) ar = w / nw
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh  // updated
    nw *= ar
    nh *= ar
    
    // calc source rectangle
    cw = iw / (nw / w)
    ch = ih / (nh / h)
    
    cx = (iw - cw) * offsetX
    cy = (ih - ch) * offsetY
    
    // make sure source rectangle is valid
    if (cx < 0) cx = 0
    if (cy < 0) cy = 0
    if (cw > iw) cw = iw
    if (ch > ih) ch = ih
    
    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
  }
  
  render () {
    let _that = this
    const OVER_VALUE = 1.5
    requestAnimationFrame(function () {
      _that.cutShape
    })
    // reset tween
    this.tl.time(0)
    
    this.tl
      .to(this.xoff, _that.animationSpeed, {
        value: _that.canvas.width * OVER_VALUE,
        ease: Power4.easeIn,
        onUpdate: function () {
          _that.cutShape()
        }
      })
      .to(this.globalAlpha, _that.animationSpeed / 2, {
        value: 0,
        ease: Power4.easeIn
      }, `-=${_that.animationSpeed}`).addCallback(() => {
      if (!_that.interval) {
        _that.interval = setInterval(() => {
          _that.changeImg()
        }, _that.autoPlaySpeed)
      }
    })
    
    _that.sliderCounter++
    
    // if ( !_that.interval ) {
    //   _that.interval = setInterval( () => {
    //     _that.changeImg()
    //   }, 5000)
    // }
    
    window.addEventListener('scroll', function () {
      let yPos = window.pageYOffset
      if (yPos < _that.canvas.height) {
        _that.tlDots
          .to(_that.offsetMove, 0.2, {
            value: _that.canvas.height / 2 + yPos * 0.8,
            overwrite: true,
            onUpdate: _that.cutShape
          })
      }
    })
    _that.tl.play()
  }
  
  changeImg () {
    let _that = this
    
    if (_that.sliderCounter - 1 < _that.images.length - 1) {
      _that.imageSrcNextSlide = _that.images[_that.sliderCounter]
      _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1]
    } else {
      _that.imageSrcNextSlide = _that.images[0]
      _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1]
      _that.sliderCounter = 0
    }
    this.render()
    
  }
  
  drawSlideNumber () {
    
    let _that = this
    if (!_that.stopAutoplay) {
      if (_that.navDots.length) {
        for (let i = 0; i < _that.navDots.length; i++) {
          _that.navDots[i].classList.remove('active')
          _that.navDots[_that.sliderCounter - 1].classList.add('active')
        }
      }
    }
    
    // _that.textGlobalAlpha = 0;
    _that.ctx.fillStyle = _that.slideNumberColor
    _that.ctx.font = `${_that.slideNumberFontSize}px ${_that.slideNumberFontFamily}`
    if (_that.showNav) {
      _that.ctx.fillText(`0${_that.getActiveIndex() + 1}`, _that.canvas.width * 0.046875, _that.canvas.height * 0.90)
    } else {
      _that.ctx.fillText(`0${_that.sliderCounter}`, _that.canvas.width * 0.046875, _that.canvas.height * 0.90)
    }
    
  }
  
  initDotsEvent () {
    let _that = this
    for (let i = 0; i < _that.navDots.length; i++) {
      _that.navDots[i].addEventListener('click', function (e) {
        _that.stopAutoplay = true
        e.preventDefault()
        
        clearInterval(_that.interval)
        
        if (this.classList.contains('active')) return
        
        _that.imageSrcCurrentSlide = _that.interval === false ? _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1] : _that.imageSrcCurrentSlide = _that.imageSrcNextSlide
        
        for (let i = 0; i < _that.navDots.length; i++) {
          _that.navDots[i].classList.remove('active')
        }
        this.classList.add('active')
        
        // let index = _that.navDots.indexOf(this)
        
        let index = _that.getActiveIndex()
        // console.log(index)
        
        _that.sliderCounter = index
        
        _that.imageSrcNextSlide = _that.images[index]
        _that.render()
        
        _that.drawSlideNumber()
      })
    }
  }
  
  getActiveIndex () {
    for (let i = 0; i < this.navDots.length; i++) {
      if (this.navDots[i].classList.contains('active')) return i
    }
  }
  
  onResize () {
    let _that = this
    // change canvas size and reinit()
    if (window.innerWidth < 1020) return
    window.addEventListener('resize', () => {
      _that.canvas.width = _that.container.offsetWidth
      _that.canvas.height = _that.container.offsetHeight
      _that.canvas.elem.width = _that.canvas.width
      _that.canvas.elem.height = _that.canvas.height
      _that.init()
      window.location.reload()
    })
  }
  
  initRetinaDisplay () {
    this.canvas.width = this.container.offsetWidth
    this.canvas.height = this.container.offsetHeight
    this.canvas.elem.width = this.canvas.width * 2
    this.canvas.elem.height = this.canvas.height * 2
    this.canvas.elem.style.width = `${this.container.offsetWidth}px`
    this.canvas.elem.style.height = `${this.container.offsetHeight}px`
    this.container.appendChild(this.canvas.elem)
    this.ctx = this.canvas.elem.getContext('2d')
    this.ctx.scale(2, 2)
  }
  
  initDefaultDisplay () {
    this.canvas.width = this.container.offsetWidth
    this.canvas.height = this.container.offsetHeight
    this.canvas.elem.width = this.canvas.width
    this.canvas.elem.height = this.canvas.height
    this.container.appendChild(this.canvas.elem)
    this.ctx = this.canvas.elem.getContext('2d')
  }
}