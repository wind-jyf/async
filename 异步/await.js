console.log('start');

function loginUser(email,password){
  return new Promise((resove,reject)=>{
    setTimeout(()=>{
      resove({userEmail:email});
    },3000);
  })
}

function getList(email){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve({courseId:'1'});
    },3000)
  })
}

function getComment(courseId){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve({comment:'评论'});
    },3000)
  })
}

//使用async，await语法糖使异步代码的书写更加接近同步
async function displayUser(){
    const user = await loginUser('234@qq.com',123);
    const course = await getList(user.userEmail);
    const comment = await getComment(course.courseId);
    console.log(comment);
}

displayUser();