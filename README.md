# 异步

#### 一、为什么要有异步？

> JavaScript是单线程语言，单线程即意味着，在一个时间段内，只能做一个事情，如果有新的事情出现，就需要加入队列中进行等待。

但我们现在打开一个网站，经常需要向服务器请求很多数据、资源，如果是同步发生，在请求的这段时间内，我们都需要进行等待，什么都做不了，那么就太影响客户体验了，这时，异步便产生了。

**那么，什么是异步任务呢？和同步任务的执行顺序又有什么不同呢？**

JavaScript有一个主线程`main thread`和调用栈`call-stack`也叫执行栈。所有任务都会放到调用栈中去等待主线程去执行它。

![img](https://raw.githubusercontent.com/wind-jyf/async/main/img/1.jpg)

1. 主线程不断循环
2. 对于**同步任务**，创建执行上下文，并按顺序进入执行栈
3. 对于**异步任务**：同样创建执行上下文，但是最终会添加到Event Queue
4. 当主线程执行完当前执行栈中的所有任务，就会去读取Event Queue中的任务队列
5. 重复执行上述操作



我们现在以一个简单的栗子来说明一下。

```JavaScript
console.log('start');
  setTimeout(()=>{
    console.log('异步')
  },2000)
console.log('finish');

//输出：start finish 异步
```

来分析下这段代码：

* 首先，`console.log('start')`进入执行栈，发现它是同步任务，于是给主线程执行
* 然后`setTimout`进入执行栈，发现是一个异步任务，先进入`Event Table`并注册相对应的回调函数，异步任务完成之后，`Event Table`会将这个函数移动到`Event Queue`
* 最后`console.log('finish')`进入执行栈，发现是同步任务，仍然给主线程执行。
* 此时执行栈为空，于是就去读取`Event Queue`中的任务
* 读取时，`console.log('finish')`进入执行栈，发现是同步任务，于是主线程执行



#### 二、模拟异步获取数据（回调地狱）

> 在从服务器动态获取数据时，我们经常需要用到ajax来异步获取，那么我们现在来模拟一下。

假设我现在首先需要通过邮箱和密码进行登录，登录之后服务器会返回给我们一个邮箱。

```javascript
function loginUser(email,password){
  setTimeout(()=>{
    return {userEmail:email} ;
  },3000)
}
const user = loginUser('236@qq.com','123');
console.log(user)

//输出：undefined
```

如果这样写，会发现user最后获取的为undefined，这便是因为上面所讲的事件循环机制，当执行到`const user = loginUser('236@qq.com','123')`时，它会把这个异步任务加入到`Event Queue`中，然后执行`console.log(user)`，最后再去读取`Event Queue`中的任务。

**那我们怎么样才可以拿到异步返回的数据呢？**

答案是通过回调中的参数进行返回。

```javascript
function loginUser(email,password,callback){
  setTimeout(()=>{
    callback({userEmail:email}) ;
  },3000)
}
const user = loginUser('236@qq.com','123',(user)=>{
	console.log(user);
});
```

现在我们拿到了邮箱，假设需要通过邮箱从服务器获取课程列表，就需要这样做。

```javascript
function getCourse(email,callback){
  setTimeout(()=>{
    callback({courseId:'1'});
  },3000)
}
function loginUser(email,password,callback){
  setTimeout(()=>{
    callback({userEmail:email}) ;
  },3000)
}
const user = loginUser('236@qq.com','123',(user)=>{
	getCourse(user.userEmail,(course)=>{
        console.log(course);
    })
});
```

这时，假设我们还需要最后一步，通过课程id拿到所有的评论。

```javascript
function getComment(courseId,callback){
  setTimeout(()=>{
    callback({comment:'评论'});
  },3000)
}
function getCourse(email,callback){
  setTimeout(()=>{
    callback({courseId:'1'});
  },3000)
}
function loginUser(email,password,callback){
  setTimeout(()=>{
    callback({userEmail:email}) ;
  },3000)
}
const user = loginUser('236@qq.com','123',(user)=>{
	getCourse(user.userEmail,(course)=>{
        getComment(course.courseId,(comment)=>{
            console.log(comment);
        })
    })
});
```

这样，我们最终拿到了课程的评价，但通过上面的代码可以看出，嵌套了很多层，也就是我们常说的回调地狱。

而且此时我们的callback只有一个，应该需要异步操作失败时一个回调，异步成功时一个回调。



#### 三、使用promise解决回调地狱

> promise会接收一个函数作为参数，这个函数又有两个参数，一个是resove，一个是reject，这两个函数由 JavaScript引擎提供。

###### resolve的作用

将promise对象的状态由"未完成"变为"完成"，在异步操作成功时调用，并将异步参数的结果，作为参数传递出去，

###### reject的作用

将promise对象的状态由"未完成"变为"失败"，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

promise实例生成以后，可以通过`then`方法来指定resolved状态和rejected状态的回调函数。

现在我们使用promise来改写一下上述代码。

```javascript
console.log('start');

function loginUser(email,password){
  return new Promise((resove,reject)=>{
    setTimeout(()=>{
      resove({userEmail:email});//异步成功，通过回调将结果传递出去
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

```

这时，我们的可读性已经非常好了，但是这还不是我们所完全想要的，我们想要的是使用同步书写代码方式去写异步代码。



#### 四、使用async改善代码

> async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

下面为使用async改写的代码

```javascript
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
```





