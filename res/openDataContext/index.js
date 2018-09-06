/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
var assets = {
  no1: "assets/ranking/no1.png",
  no2: "assets/ranking/no2.png",
  no3: "assets/ranking/no3.png",
  next: "assets/ranking/next.png",
  last: "assets/ranking/last.png",
  avatar: "assets/ranking/avatar.png"
};
/**
 * canvas 大小
 * 这里暂时写死
 * 需要从主域传入
 */
let canvasWidth;
let canvasHeight;


let lineWidth = 400;
let lineHeight = 60;
let startXY;
let maxScore = 0;

getMyScore();

/**
 * 加载资源函数
 * 理论上只需要加载一次，且在点击时才开始加载
 * 最好与canvasWidht和canvasHeight数据的传入之后进行
 */
preloadAssets();

//读取玩家数据
preloadPlayerData();



//获取canvas渲染上下文
var context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";


/**
 * 所有头像数据
 * 包括姓名，头像图片，得分
 * 排位序号i会根据parge*perPageNum+i+1进行计算
 */
/**
 * 测试模拟数据
 */
let url = "assets/ranking/avatar.png";  //可以把url换成你的头像网络地扯用于测试

/**
 * 创建排行榜
 */
function drawRankPanel() {
  //绘制背景
  console.log(startXY);
  context.fillStyle = "#262832";    
  context.fillRect(offsetX_rankToBorder, offsetY_rankToBorder-20, RankWidth, RankHeight);
  //绘制标题
  context.font = (fontSize + 10) + "px Arial";
  // let title = assets.title;
  // //根据title的宽高计算一下位置;
  
  let titleX = offsetX_rankToBorder + RankWidth / 2;
  let titleY = offsetY_rankToBorder + textOffsetY-10;  
  context.fillStyle = "#cccccc";
  context.textAlign = 'center';
  context.fillText("好友排行榜", titleX, titleY, RankWidth / 2.5);
  //获取当前要渲染的数据组
  let start = perPageMaxNum * page;
  // currentGroup = totalGroup.slice(start, start + perPageMaxNum);
  currentGroup = friendData.slice(start, start + perPageMaxNum);
  //创建头像Bar
  drawRankByGroup(currentGroup);
  // //创建按钮
  drawButton()
}
/**
 * 根据屏幕大小初始化所有绘制数据
 */
function init() {

  var ratio = 1334 / stageHeight * stageWidth / 750;

  //排行榜绘制数据初始化  
  RankWidth = stageWidth * 4 / 5;  
  RankHeight = stageHeight * 3 / 5;
  barWidth = RankWidth * 4 / 5 ;
  barHeight = RankHeight / 11;  
  fontSize = barHeight - 30;

  offsetX_rankToBorder = (stageWidth - RankWidth) / 2;
  offsetY_rankToBorder = (stageHeight - RankHeight) / 2;
  preOffsetY = barHeight;

  startX = offsetX_rankToBorder;
  startY = offsetY_rankToBorder + barHeight;
  avatarSize = barHeight - 20 ;
  cupSize = barHeight - 10;
  intervalX = barWidth * ratio / 15;
  textOffsetY = (barHeight + fontSize) / 2 - 6;
  cupOffsetY = (barHeight + cupSize) / 2;
  textMaxSize = RankWidth / 5;
  indexWidth = context.measureText("99").width;

  //按钮绘制数据初始化
  buttonWidth = barWidth / 3;
  buttonHeight = barHeight / 2;
  buttonOffset = RankWidth / 3;
  lastButtonX = offsetX_rankToBorder + buttonOffset - buttonWidth;
  nextButtonX = offsetX_rankToBorder + 2 * buttonOffset;
  nextButtonY = lastButtonY = offsetY_rankToBorder + RankHeight + buttonHeight;
  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;
}

/**
 * 创建两个点击按钮
 */
function drawButton() {
  // context.drawImage(assets.next, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
  // context.drawImage(assets.last, lastButtonX, lastButtonY, buttonWidth, buttonHeight);
}


/**
 * 根据当前绘制组绘制排行榜
 */
function drawRankByGroup(currentGroup) {
  for (let i = 0; i < currentGroup.length; i++) {
    let data = currentGroup[i];
    drawByData(data, i);

  }
}

/**
 * 根据绘制信息以及当前i绘制元素
 */
function drawByData(data, i) {
  let x = startX;
  //绘制底框
  if (i % 2 == 0) {
    context.fillStyle = "#1e2029";
    context.fillRect(startX, startY + i * preOffsetY, RankWidth, barHeight);
  }


  x += 35;
  //设置字体
  context.fillStyle = "#cccccc";
  context.font = fontSize + "px Arial";
  //绘制序号
  let index = page * perPageMaxNum + i + 1
  if ((index != 1 && index != 2 && index != 3)) {
    context.fillText(index.toString(), x + 5, startY + i * preOffsetY + textOffsetY, textMaxSize);
  }
  x += cupSize + intervalX;
  var ratio = 1334 / stageHeight * stageWidth / 750;
  //绘制头像
  if (loadAvatarFail) {
    context.drawImage(assets.avatar, x, startY + i * preOffsetY + (barHeight - avatarSize) / 2, avatarSize * ratio , avatarSize);
  } else {
    context.drawImage(data.avatar, x, startY + i * preOffsetY + (barHeight - avatarSize) / 2, avatarSize * ratio, avatarSize);
  }
  x += avatarSize + intervalX;
  //绘制名称
  context.textAlign = 'left';
  context.fillText(data.name + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  x += textMaxSize + intervalX;
  //绘制分数
  context.textAlign = 'left';
  context.fillText(data.score + "", RankWidth - intervalX, startY + i * preOffsetY + textOffsetY, textMaxSize);

  //画奖杯
  if ((i == 0 || i == 1 || i == 2) && page == 0) {
    let no = "no" + (i + 1);
    context.drawImage(assets[no], startX + 10, startY + i * preOffsetY + 7, cupSize * ratio, cupSize);
  }
}

/**
 * 点击处理
 */
function onTouchEnd(event) {

  let x = event.clientX * sharedCanvas.width / canvasWidth;   //子域canvas大小与真实canvas大小不一样，算出比例值用于校正坐标。
  let y = event.clientY * sharedCanvas.height / canvasHeight;
  if (x > lastButtonX && x < lastButtonX + buttonWidth
    && y > lastButtonY && y < lastButtonY + buttonHeight) { //
    //在last按钮的范围内
    console.log('inner last..');
    buttonClick(0);
    if (page > 0) {
      buttonClick(0);

    }
  }
  if (x > nextButtonX && x < nextButtonX + buttonWidth
    && y > nextButtonY && y < nextButtonY + buttonHeight) {
    //在next按钮的范围内
    if ((page + 1) * perPageMaxNum < friendData.length) {
      buttonClick(1);
    }
  }

}
/**
 * 根据传入的buttonKey 执行点击处理
 * 0 为上一页按钮
 * 1 为下一页按钮
 */
function buttonClick(buttonKey) {
  let old_buttonY;
  if (buttonKey == 0) {
    // //上一页按钮
    // old_buttonY = lastButtonY;
    // lastButtonY += 10;
    // page--;
    // renderDirty = true;
    // console.log('上一页');
    // setTimeout(() => {
    //   lastButtonY = old_buttonY;
    //   //重新渲染必须标脏
    //   renderDirty = true;
    // }, 100);
    console.log('hide canvas');
    let openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage({
      type: 'hideCavnas',
      text: text,
    });   

  } else if (buttonKey == 1) {
    //下一页按钮
    old_buttonY = nextButtonY;
    nextButtonY += 10;
    page++;
    renderDirty = true;
    console.log('下一页');
    setTimeout(() => {
      nextButtonY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
  }

}

/////////////////////////////////////////////////////////////////// 相关缓存数据

/**********************数据相关***************************/

/**
 * 渲染标脏量
 * 会在被标脏（true）后重新渲染
 */
let renderDirty = true;

/**
 * 当前绘制组
 */
let currentGroup = [];
/**
 * 每页最多显示个数
 * 建议大于等于4个
 */
let perPageMaxNum = 10;
/**
 * 当前页数,默认0为第一页
 */
let page = 0;
/***********************绘制相关*************************/
/**
 * 舞台大小
 */
let stageWidth;
let stageHeight;
/**
 * 排行榜大小
 */
let RankWidth;
let RankHeight;

/**
 * 每个头像条目的大小
 */
let barWidth;
let barHeight;
/**
 * 条目与排行榜边界的水平距离
 */
let offsetX_barToRank
/**
 * 绘制排行榜起始点X
 */
let startX;
/**
 * 绘制排行榜起始点Y
 */
let startY;
/**
 * 每行Y轴间隔offsetY
 */
let preOffsetY;
/**
 * 按钮大小
 */
let buttonWidth;
let buttonHeight;
/**
 * 上一页按钮X坐标
 */
let lastButtonX;
/**
 * 下一页按钮x坐标
 */
let nextButtonX;
/**
 * 上一页按钮y坐标
 */
let lastButtonY;
/**
 * 下一页按钮y坐标
 */
let nextButtonY;
/**
 * 两个按钮的间距
 */
let buttonOffset;

/**
 * 字体大小
 */
let fontSize = 35;
/**
 * 文本文字Y轴偏移量
 * 可以使文本相对于图片大小居中
 */

let cupSize = 64;
let cupOffsetY;

let textOffsetY;
/**
 * 头像大小
 */
let avatarSize;
/**
 * 名字文本最大宽度，名称会根据
 */
let textMaxSize;
/**
 * 绘制元素之间的间隔量
 */
let intervalX;
/**
 * 排行榜与舞台边界的水平距离
 */
let offsetX_rankToBorder;
/**
 * 排行榜与舞台边界的竖直距离
 */
let offsetY_rankToBorder;
/**
 * 绘制排名的最大宽度
 */
let indexWidth;

//玩家数据
let friendData;

let loadAvatarFail = true;
//////////////////////////////////////////////////////////
/**
 * 监听点击
 */
wx.onTouchEnd((event) => {
  var l = event.changedTouches.length;
  for (var i = 0; i < l; i++) {
    onTouchEnd(event.changedTouches[i]);
  }
});


/**
 * 资源加载
 */
function preloadAssets() {
  var preloaded = 0;
  var count = 0;
  for (var asset in assets) {
    count++;
    var img = wx.createImage();
    img.onload = function () {
      preloaded++;
      if (preloaded == count) {
        console.log("pre load assets ok..");
        setTimeout(function () {
          // createScene();
          //预加载头像
          preloadAvatar();
        }, 500);
      }
    }
    img.src = assets[asset];
    assets[asset] = img;
  }
}

/**
 * 头像加载
 */
function preloadAvatar() {
  console.log('preload avatar...');
  //如果超过1.5秒没有加载成功，使用默认头像 
  setTimeout(() => {
    if (loadAvatarFail) {
      console.log("头像加载失败");
      createScene();
    }

  }, 1500);
  let preloaded = 0;
  let count = 0;
  for (var i in friendData) {
    count++;
    let img = wx.createImage();
    //处理没有头像的情况
    if (friendData[i]['avatar'] == "") {
      friendData[i]['avatar'] = assets.avatar;
      preloaded++;
    } else {
      img.src = friendData[i]['avatar'];
      friendData[i]['avatar'] = img;
    }
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        loadAvatarFail = false;
        console.log("头像加载完毕");
        setTimeout(_ => {
          createScene();
        }, 500);
      }
    }
  }
}


//重新加载头像
function loadAvatar() {
  console.log('reload avatar...');
  //如果超过1.5秒没有加载成功，使用默认头像 
  setTimeout(() => {
    if (loadAvatarFail) {
      console.log("头像加载失败");
      //标记重绘变量，让子域重绘数据
      renderDirty = true;
    }

  }, 1500);
  let preloaded = 0;
  let count = 0;
  for (var i in friendData) {
    count++;
    let img = wx.createImage();
    img.src = friendData[i]['avatar'];
    friendData[i]['avatar'] = img;
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        loadAvatarFail = false;
        console.log("头像加载完毕");
        setTimeout(_ => {
          //标记重绘变量，让子域重绘数据
          renderDirty = true;
        }, 500);
      }
    }
  }
}

function getUserInfo() {
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: res => {
      myInfo = res.data[0];
      console.log('myInfo');
      console.log(myInfo);
    },
    fail: res => {
    }
  })
}

function getMyScore() {
  wx.getUserCloudStorage({
    keyList: ['score'],
    success: res => {
      let data = res;
      console.log(data);
      maxScore = data.KVDataList[0].value || 0;     
    }
  });
}

function saveMaxScore(maxScore) {
  wx.setUserCloudStorage({
    KVDataList: [{ 'key': 'score', 'value': ('' + maxScore) }],
    success: res => {
      console.log(res);
    },
    fail: res => {
      console.log(res);
    }
  });
}

/**
 * 读取player数据
 */
function preloadPlayerData() {
  wx.getFriendCloudStorage({
    keyList: ['score'],
    success: res => {
      friendData = res.data;
      console.log(friendData);
      friendData = dealAndSortData(friendData);
      console.log(friendData);
    },
    fail: err => {
      console.log(err);
    },
    complete: () => {

    }
  });

  wx.onMessage(data => {
    if (data.type == 'friends') {
      wx.getFriendCloudStorage({
        keyList: ['score'],
        success: res => {
          console.log('res data');
          console.log(res.data);

          friendData = dealAndSortData(res.data);
          loadAvatar();

        },
        fail: err => {
          console.log(err);
        },
        complete: () => {

        }
      });
    } else if (data.type == 'updateMaxScore') {
      var currentlevel = parseInt(data.text);
      if (currentlevel > maxScore) {
        maxScore = currentlevel;
        saveMaxScore(maxScore);
      }
    }
    
  });
}

//处理玩家数据，排序
function dealAndSortData(source) {
  let dist = [];
  source.forEach(element => {
    console.log('dealAndSortData')
    console.log(element);
    let item = {};
    item['name'] = element['nickname'];
    item['avatar'] = element['avatarUrl'];
    item['score'] = element['KVDataList'][0]['value'];
    dist.push(item);
  });

  dist.sort((obj1, obj2) => {
    let val1 = parseInt(obj1['score']);
    let val2 = parseInt(obj2['score']);
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  });

  return dist;
}

/**
 * 绘制屏幕
 * 这个函数会在加载完所有资源之后被调用
 */
function createScene() {
  console.log('createScene.');
  if (sharedCanvas.width && sharedCanvas.height) {
    console.log('初始化完成')
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;
  } else {
    console.log(`sharedCanvas.width:${sharedCanvas.width}    sharedCanvas.height：${sharedCanvas.height}`)
  }
  init();
  requestAnimationFrame(loop);
}
/**
 * 循环函数
 * 每帧判断一下是否需要渲染
 * 如果被标脏，则重新渲染
 */
function loop() {
  if (renderDirty) {
    console.log(`stageWidth :${stageWidth}   stageHeight:${stageHeight}`)
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);

    // context.fillStyle = "#00000055";
    // context.fillRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    drawRankPanel();
    renderDirty = false;
  }
  requestAnimationFrame(loop);
}


// let a = "تسجيل الدخول عبر فيس بوك"