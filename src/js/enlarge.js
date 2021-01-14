/*
  放大镜的逻辑和代码
*/

/*
  抽象内容
    属性:
      1. 范围元素属性
      2. show 盒子属性
        => 需要绑定一个移动事件
      3. mask 盒子属性
        => 因为遮罩层要设置 left 和 top 属性
      4. enlarge 盒子属性
        => 因为要设置背景图定位位置
      5. list 盒子属性
        => 用于切换图片内容
      6. show 盒子的尺寸属性
      7. 背景图尺寸属性
      8. enlarge 盒子的尺寸属性
    方法:
      1. 显示隐藏方法
        => 当光标移入 show 盒子区域的时候, 显示 mask 和 enlarge
        => 当光标移出 show 盒子区域的时候, 隐藏 mask 和 enlarge
      2. 调整元素成比例方法
        show 盒子尺寸      背景图尺寸
        ------------ = --------------
        mask 盒子尺寸   enlarge 盒子尺寸
      3. 移动事件的方法
        => 给该实例对象的 show 盒子绑定一个移动事件
        => 在移动事件里面, 让 mask 盒子随着鼠标移动
        => 在移动事件里面, 让 enlarge 盒子的背景图定位联动
      4. 切换列表的方法
        => 点击列表选项的时候, 整套的切换图片
      5. 启动器方法
        => 把每一个功能都直接启动
*/

function Enlarge(select) {
  // 范围元素
  this.ele = document.querySelector(select)
  // show 盒子: 范围内的 .show
  this.show = this.ele.querySelector('.show')
  // mask 盒子
  this.mask = this.ele.querySelector('.mask')
  // enlarge 盒子
  this.enlarge = this.ele.querySelector('.enlarge')
  // list 盒子
  this.list = this.ele.querySelector('.list')
  // show 盒子的宽度
  this.showWidth = this.show.clientWidth
  // show 盒子的高度
  this.showHeight = this.show.clientHeight
  // 背景图宽度
  this.bgWidth = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
  // 背景图高度
  this.bgHeight = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
  // enlarge 盒子的宽度
  this.enlargeWidth = parseInt(window.getComputedStyle(this.enlarge).width)
  // enlarge 盒子的高度
  this.enlargeHeight = parseInt(window.getComputedStyle(this.enlarge).height)

  // new 完就直接出现效果
  // 直接调用启动器
  this.init()
}

// 提前准备一个方法叫做启动器
Enlarge.prototype.init = function () {
  // this.overOut()
  this.setScale()
  this.setMove()
  this.changeList()
}

// 方法书写在原型上
/*
  移入移出
    + 给谁绑定事件 ?
      => 给该实例的 show 盒子绑定事件
    + 移入的时候 ?
      => 让该实例的 mask 和 enlarge 显示
    + 移出的时候 ?
      => 让该实例的 mask 和 enlarge 消失
*/
Enlarge.prototype.overOut = function () {
  // 移入事件
  this.show.addEventListener('mouseover', () => {
    this.mask.style.display = 'block'
    this.enlarge.style.display = 'block'
  })
  // 移出事件
  this.show.addEventListener('mouseout', () => {
    this.mask.style.display = 'none'
    this.enlarge.style.display = 'none'
  })
}

/*
  调整比例

  需要四个内容成为这个样子的比例
    show 盒子尺寸      背景图尺寸
    ------------ = --------------
    mask 盒子尺寸   enlarge 盒子尺寸
  公式变形
    mask 盒子尺寸 * 背景图尺寸 = show 盒子尺寸 * enlarge 盒子尺寸
    mask 盒子尺寸 = show 盒子尺寸 * enlarge 盒子尺寸 / 背景图尺寸
  1. 计算出 mask 盒子的尺寸
  2. 给 mask 盒子进行赋值
*/
Enlarge.prototype.setScale = function () {
  // 1. 计算 mask 盒子的尺寸
  this.maskWidth = this.showWidth * this.enlargeWidth / this.bgWidth
  this.maskHeight = this.showHeight * this.enlargeHeight / this.bgHeight

  // 2. 给 mask 盒子赋值
  this.mask.style.width = this.maskWidth + 'px'
  this.mask.style.height = this.maskHeight + 'px'
}

/*
  移动联动

  1. 绑定事件
    => 给 this.show 绑定给一个鼠标移动事件
  2. 获取坐标
    => offset 一组
    => 因为 offset 相对的是目标元素的左上角的坐标位置
    => 原因:
      -> 因为 mask 盒子作为目标元素的时候, 会出现坐标偏差
    => 解决:
      -> 只要我再 show 盒子上移动的时候, mask 永远不作为事件目标
      -> 给 mask 盒子添加一个 css 样式, 让他不做为目标元素使用
  3. 进行边界值判断
    => 左边极限值 0
    => 右边极限值 show 宽度 - mask 宽度
    => 上边极限值 0
    => 下边极限值 show 高度 - mask 高度
  4. 赋值
    => 为了保证光标在中间, 让他向左上移动一些距离
  5. 计算右边背景图移动距离
      mask 盒子尺寸       mask 盒子移动距离
    --------------- = ---------------------
    enlarge 盒子尺寸       背景图片移动距离
    背景图片移动距离 * mask 盒子尺寸 = mask 盒子移动距离 * enlarge 盒子尺寸
    背景图片移动距离 = mask 盒子移动距离 * enlarge 盒子尺寸 / mask 盒子尺寸
*/
Enlarge.prototype.setMove = function () {
  // 1. 给 this.show 绑定事件
  this.show.addEventListener('mousemove', e => {
    // 处理事件对象兼容
    e = e || window.event

    // 2. 获取坐标了
    let moveX = e.offsetX - this.maskWidth / 2
    let moveY = e.offsetY - this.maskHeight / 2

    // 3. 边界值判断
    if (moveX <= 0) moveX = 0
    if (moveY <= 0) moveY = 0
    if (moveX >= this.showWidth - this.maskWidth) moveX = this.showWidth - this.maskWidth
    if (moveY >= this.showHeight - this.maskHeight) moveY = this.showHeight - this.maskHeight

    // 4. 赋值
    this.mask.style.left = moveX + 'px'
    this.mask.style.top = moveY + 'px'

    // 5. 计算背景图移动距离
    const bgX = moveX * this.enlargeWidth / this.maskWidth
    const bgY = moveY * this.enlargeHeight / this.maskHeight

    // 给 enlarge 盒子的 backgroundPosition 进行赋值
    this.enlarge.style.backgroundPosition = `-${ bgX }px -${ bgY }px`
  })
}

/*
  实现点击列表切换
    + 采用事件委托的形式
    1. 给谁绑定事件 ?
      => this.list 盒子绑定事件
    2. 判断切换 ?
      => 当我点击的 target 是 img 标签的时候, 进行切换
    3. 怎么换 ?
      => 需要在你渲染的时候, 把需要切换的路径地址记录在元素身上
      => 当你点击的时候, 拿到自定义属性, 你记录的地址来进行切换
    4. 分别给两个元素进行赋值
      => showUrl 赋值给 this.show 的第一个子元素
      => enlargeUrl 赋值给 this.enlarge 的 背景图
    5. 需要边框颜色配套
      => 需要 this.list 里面的每一个子元素都没有 active 类名
      => 指定点击的这一个 p 标签要添加类名
      => 注意: 你点击的是 img 标签, 他的父元素才是 p 标签
*/
Enlarge.prototype.changeList = function () {
  // 1. 给 this.list 盒子绑定事件
  this.list.addEventListener('click', e => {
    // 处理事件对象兼容
    e = e || window.event
    // 处理事件目标兼容
    const target = e.target || e.srcElement

    // 2. 条件判断
    if (target.nodeName === 'IMG') {
      // 3. 拿到元素身上两个自定义属性存储的地址
      const showUrl = target.dataset.show
      const enlargeUrl = target.dataset.enlarge

      // 4. 进行赋值
      this.show.firstElementChild.src = showUrl
      this.enlarge.style.backgroundImage = `url(${ enlargeUrl })`

      // 5. 边框配套
      for (let i = 0; i < this.list.children.length; i++) {
        this.list.children[i].classList.remove('active')
      }
      // 指定的这一个添加类名
      target.parentElement.classList.add('active')
    }
  })
}
