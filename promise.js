/**
 * promise会接收一个函数作为参数，这个函数又有两个参数，一个是resove，一个是reject，这两个函数由引擎提供。
 * Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数，第一个是resove
 */
// function timeout(ms) {
//     return new Promise((resolve, reject) => {
//         //console.log(resolve());
//       setTimeout(resolve, ms, 'done');
//     });
//   }
  
//   timeout(100).then((value) => { 
//     console.log(value);
//   });



//使用promise解决回调地狱
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

loginUser('234@qq.com',123)
.then(user=>getList(user.userEmail))
.then(course=>getComment(course.courseId))
.then(comment=>{
  console.log(comment);
})

//使用promise.all

function getAllVideo(){
  return new Promise((resove,reject)=>{
    setTimeout(()=>{
      resove({videos:[1,2,3]});
    },2000);
  })
}

function getAllUser(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve({user:'name'});
    },5000);
  })
}

Promise.all([getAllVideo(),getAllUser()])
.then(result=>{
  console.log(result);
})