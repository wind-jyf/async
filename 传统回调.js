//javscript是单线程，回调函数也可以同步，不一定都是异步的

//传统回调
console.log('start');

function loginUser(email,password,callback){
  setTimeout(()=>{
    callback({userEmail:email});
  },3000)
}

function getList(email,callback){
  setTimeout(()=>{
    callback({courseId:'1'});
  },3000)
}

function getComment(courseId,callback){
  setTimeout(()=>{
    callback({comment:'评论'});
  },3000)
}

const user = loginUser('234@qq.com',123,(user)=>{
  console.log(user);
  getList(user.userEmail,(course)=>{
    console.log(course);
    getComment(course.courseId,(comment)=>{
      console.log(comment);
    })
  })
})

console.log('finish')

