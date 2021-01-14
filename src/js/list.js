//入口函数
$(function(){ 

//1.准备一个商品信息对象
  const list_info={
      cat_one:'all',
      cat_two:'all',
      cat_three:'all',
      sort:'id',
      sortType:'ASC',
      current:1,
      pagesize:12,
  }
//2.请求一级分类列表
getCatOne()
async function getCatOne(){
  //2.1请求一级分类列表
  const{list} = await $.get("./server/catOne.php",null,null,"json")
  // console.log(list)
 //2.2渲染页面
 let str = `<span class="active">全部</span>`
 list.forEach(item =>{
   str+=`<span>${item.cat_one_id}</span>`
 })
//  console.log(str)
$('.cat_one .right').html(str)

}
//3.一级分类的点击事件
$(".cat_one .right").on("click","span",function(){
 //3.1切换类名
 $(this).addClass("active").siblings().removeClass("active")
 //3.2拿到这个点击的span的分类内容
 const cat_one = $(this).text()
 //3.3修改list.info
 //因为每一次的切换都要重新请求商品列表
 list_info.cat_one =cat_one
 //任何一个一级列表的变换都要把二级列表修改为all
 list_info.cat_two ="all"
 //同时把三级列表修改为all
 list_info.cat_three = "all"
 //给三级列表回归
 $(".cat_three .right").html('<span class="active">全部</span>')

 //3.4请求二级列表
 //如果点击的是其全部，那么不请求二级列表
 //点击的不是全部的时候，请求二级列表
 if(cat_one ==="全部"){
   //点击的全部，给二级列表回归
   $(".cat_two .right").html("<span class='active'>全部</span>")
   //把list——info里边的  cat_one  改成  all
   list_info.cat_one = "all"
 }else{
  //4.1请求二级分类列表 
  getCatTwo()
}
 
 getCount()
})
async function getCatTwo(){
  //4.2请求数据，参数是一级分类列表
   const {list}= await $.get("./server/catTwo.php",{cat_one:list_info.cat_one},null,"json")
  //4.2渲染页面
  let str= "<span class='active'>全部</span>"
  list.forEach(item =>{
    str+=`<span>${item.cat_two_id}</span>`
  })
  $(".cat_two .right").html(str)
}
  //5.二级分类列表的事件
  $(".cat_two .right").on("click","span",function(){
    //5.1 切换类名
   $(this).addClass("active").siblings().removeClass("active")
   //5.2拿到分类的内容
   const cat_two = $(this).text()
   //修改 list_info
   list_info.cat_two =cat_two
   list_info.cat_three = "all"
   //条件判断请求三级分裂列表
   if(cat_two==="全部"){
     //让list_info里边的cat_two变成all
   list_info.cat_two = "all"
   //让三级列表回归
   $(".cat_three .right").html("<span class='active'>全部</span>")
   }else{
     getCatThree()
   }
   getCount()
  })
 
//请求三级分类列表
async function getCatThree(){
 //发送请求
 const { list} = await $.get("./server/catThree.php",{cat_one:list_info.cat_one,cat_two:list_info.cat_two},null,'json')
 let str='<span class="active">全部</span>'
 list.forEach(item =>{
     str+=`<span>${item.cat_three_id}</span>`
 })
 $('.cat_three .right').html(str)
}

 //三级分类的点击事件
 $('.cat_three .right').on('click','span',function(){
   //切换类名
   $(this).addClass('active').siblings().removeClass("active")
   const cat_three = $(this).text()
   //修改list_info里边的cat_three
   list_info.cat_three = cat_three
   //条件判断
   if(cat_three==="全部"){
     list_info.cat_three ="all"
   }
   getCount()
 })
   //请求总数
   getCount()
    async function getCount(){
       const {count}=await $.get('./server/getCount.php',{cat_one:list_info.cat_one,cat_two:list_info.cat_two,cat_three:list_info.cat_three},null,"json")
       new Pagination('.pagination',{
       total:count,
       pagesize:12,
       sizeList:[12,16,20,24],
       change(current,pagesize){
         list_info.current =current
         list_info.pagesize=pagesize
         getGoodsList()
       }
     })
  }
   
   //请求商品列表
   async function getGoodsList(){
     const {list} = await $.get('./server/goodsList.php',list_info,null,'json')

     //渲染页面
     let str = ''
     list.forEach(item=>{
      str += `
        <li class="thumbnail">
          <img src="${ item.goods_big_logo }" alt="...">
          <div class="caption">
            <h3 data-id="${ item.goods_id }">${ item.goods_name }</h3>
            <p class="price">￥ <span class="text-danger">${ item.goods_price }</span></p>
            <p>
              <a href="javascript:;" class="btn btn-danger" role="button">加入购物车</a>
              <a href="./cart.html" class="btn btn-warning" role="button">去结算</a>
            </p>
          </div>
        </li>
      `
     })
     $(".goodsList ul").html(str)
    }
   // 排序方式的切换
   $('.sort_list .right').on('click','span',function(){

    if(list_info.sort === this.dataset.sort){
      list_info.sortType = list_info.sortType ==='ASC'?'DESC':'ASC'
    }else{
      list_info.sortType = 'ASC'
    }
    list_info.sort =this.dataset.sort
    list_info.current=1
    $(this).addClass('active').siblings().removeClass('active')
    getGoodsList()
   })
   $('.goodsList ul').on('click','h3',function(){
   window.sessionStorage.setItem("goods_id",this.dataset.id)
   window.location.href='./detail.html'

   })

})


