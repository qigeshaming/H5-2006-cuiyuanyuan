

     //获取cookie值
     const nickname =getCookie("nickname")
     if(nickname){
         //如果登录过
         $(".off").addClass("hide")
         $(".on").text(`${nickname}`).removeClass("hide")
     }
    else{
        //没有登录过
        $(".off").removeClass("hide")
        $(".on").addClass("hide")
    }
  
 

const ul = document.querySelector('.search-list')

// 1. 给 input 绑定一个 input 事件
const inp = document.querySelector('.search-text')
inp.addEventListener('input', function () {
  // 2. 拿到用户输入的内容
  const text = this.value.trim()

  // 3. 通过动态创建 script 标签的方式来发送请求
  const script = document.createElement('script')
  // 添加 src 属性
  // 原生属性, 直接元素.属性名 = 属性值
  script.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,33222,33306,33259,33235,32973,33351,33313,33312,33311,33310,33309,33308,33307,33145,22159,33389&wd=${ text }&req=2&csor=4&pwd=aiq&cb=bindHtml&_=1608775410035`
  // 插入到 body 内部
  document.body.appendChild(script)
  // 卸磨杀驴
  // 使用完毕以后偶, 直接删除 script 标签
  // remove() 直接把自己干掉
  script.remove()
})


// 4. 准备一个请求回来的函数
function bindHtml(res) {
  console.log(res)
  // 4-2. 判断是否有 g 的存在
  if (!res.g) {
    // 表示 g 不存在
    ul.style.display = 'none'
    return
  }

  // 能来到这里, 表示 res.g 存在, 那么就循环遍历 res.g 渲染页面
  let str = ''
  res.g.forEach(item => {
    str += `
      <li>${ item.q }</li>
    `
  })
  // 渲染完毕以后, 插入到 ul 内部
  ul.innerHTML = str
  // 让 ul 显示出来
  ul.style.display = 'block'
}






/* 轮播图 */
//获取元素
const bannerBox = document.querySelector(".banner1")
const imgBox = document.querySelector(".imgBox")
const pointBox =document.querySelector(".pointBox")
const leftRightbox =document.querySelector(".leftRight")
const leftBtn =document.querySelector(".left")
const rightBtn = document.querySelector(".right")

//获取窗口的宽度
const banner_width =bannerBox.clientWidth
//准备一个变量记录当前是第几张照片
let index = 1
//准备一个变量，接受定时器返回值
let timer = 0
//准备一个变量，表示开关
let flag = true

//1、创建焦点
setPoint()
function setPoint(){
  //1.1获取到多少个焦点
 const pointNum =imgBox.children.length
 //1.2/生成对应的焦点
 const frg = document.createDocumentFragment()
 for (let i=0;i<pointNum;i++){
    //生成pointbox里边的li
    const li =document.createElement("li")
    //判断是否为第一个，给第一个添加active
    if(i===0) li.classList.add("active")
    //把索引记录在元素身上
    li.dataset.page = i
    frg.appendChild(li)
 }
   //把框里的东西添加到pointBox里边
   pointBox.appendChild(frg)
   //根据当前焦点个数，来调整pointbox的大小
   pointBox.style.width=pointNum*(20+10)+"px"
}

//2.复制元素
copyEle()
function copyEle(){
    //复制imgbox里边的第一张图片跟最后一张图片
const first =imgBox.firstElementChild.cloneNode(true)
const last =imgBox.lastElementChild.cloneNode(true)
  //将克隆的元素插入到指定位置
  imgBox.appendChild(first)
  imgBox.insertBefore(last,imgBox.firstElementChild)
//调整imgbox的宽度
 imgBox.style.width=imgBox.children.length*100+"%"
 //调整imgbox的初始定位关系
 imgBox.style.left =-banner_width+"px"
}

//自动轮播
autoPlay()
function autoPlay(){
   timer=setInterval (()=>{
    index++

    //利用move函数让imgbox动起来
    move(imgBox,{left:-index*banner_width},moveEnd)
    
   },2000)

}

//运动结束
function moveEnd(){
 // 判断图片是不是来到了最后一张
 if(index===imgBox.children.length-1){
     //令imgbox的索引为1，瞬间定位到第一张图
     index=1 
     //此时imgbox的位置
     imgBox.style.left=-index*banner_width+"px"
 }
 if(index===0){
   index=imgBox.children.length-2
   imgBox.style.left=-index*banner_width+"px"
 }
 //设置焦点配套
 for(let i=0;i<pointBox.children.length;i++){
 //给所有的焦点去除类名
    pointBox.children[i].classList.remove("active")
 }
//给索引配套的焦点添加类名
 pointBox.children[index-1].classList.add("active")
 //代码执行到这里，表示一次运动结束了，已经可以进行正常的图片切换了。
 //将开关打开
 flag=true
}

//移入移出
overOut()
function overOut(){
//移入banner的时候，停止定时器
bannerBox.addEventListener("mouseover",()=>clearInterval(timer))

//移出banner的时候，开启定时器
bannerBox.addEventListener("mouseout",()=>autoPlay())

}

//左右切换
leftRight()
function leftRight(){
//给右按钮添加点击事件
rightBtn.addEventListener("click",()=>{
//判断开关的状态
//如果开关是关闭状态，不执行后续操作
if(flag===false)return
flag=false
 index++
 move(imgBox,{left:-index*banner_width},moveEnd)
 //顺手把开关关上
 
})

//给左点击按钮添加点击事件
leftBtn.addEventListener("click",()=>{
//判断开关的状态
//如果是关闭状态的话就不执行后续操作
if(flag===false)return
flag=false
index--
move(imgBox,{left:-index*banner_width},moveEnd)
})




}

//焦点切换
pointEvent()
function pointEvent(){
 //事件委托的行驶给pointbox绑定点击事件
 pointBox.addEventListener("click",e=>{
 //处理事件对象兼容
 e = e ||window.event
 //处理事件目标兼容
 const target = e.target||e.srcElement
//判断你点击的确实是焦点按钮
if(target.nodeName==="LI"){
 //进行开关的判断
 if(!flag) return
 flag = false
 
 //拿到你点击的这个属性身上的data-page属性
 const page=target.dataset.page-0
 //调整imgbox
 //给index赋值

 index=page +1
 move(imgBox,{left:-index*banner_width},moveEnd)
}
 })
}


//切换页面
tabChange()
function tabChange(){
//该document绑定点击事件
document.addEventListener("visibilitychange",()=>{
//判断document身上的visibilityState属性的值
const state = document.visibilityState
//表示离开的时候关闭定时器
if(state==="hidden")clearInterval(timer)
//表示回来的时候，开启自动轮播
if(state==="visible") autoPlay()

})
}


$(window).scroll(function(){
  const scrollTop= document.documentElement.scrollTop  || document.body.scrollTop  
  scrollTop>= 300?$(".go-top").fadeIn(500):$(".go-top").fadeOut("500")
})
$(".go-top").click(function(){
 $("html,body").animate({scrollTop:0},1000)

})





