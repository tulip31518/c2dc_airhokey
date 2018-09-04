__require=function t(e,i,s){function o(n,c){if(!i[n]){if(!e[n]){var l=n.split("/");if(l=l[l.length-1],!e[l]){var r="function"==typeof __require&&__require;if(!c&&r)return r(l,!0);if(a)return a(l,!0);throw new Error("Cannot find module '"+n+"'")}}var h=i[n]={exports:{}};e[n][0].call(h.exports,function(t){return o(e[n][1][t]||t)},h,h.exports,t,e,i,s)}return i[n].exports}for(var a="function"==typeof __require&&__require,n=0;n<s.length;n++)o(s[n]);return o}({Ball:[function(t,e,i){"use strict";cc._RF.push(e,"ad9daw9YMlMz56XqQx3TMz/","Ball");var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};cc.Class({extends:cc.Component,properties:{Radius:30,_nextPosition:null,_vector:null,STATE_SHOW:1,STATE_LIVE:2,STATE_HIDE:4,rigid:0,circle:null,startPosition:null,state:1,player_won_round:!1,tail:null,motionStreak:null,tailImage:null,overlapped_timer:0,size:1,lastVecNonZero:null,gameInstance:{default:null,serializable:!1},gameConfig:{default:null,type:cc.Node}},onLoad:function(){this._nextPosition=cc.v2(0,-23),this._vector=cc.v2(0,0)},start:function(){},update:function(t){},onContacted:function(){},radius:function(){return this.Radius},setBallPosition:function(t){this.node.setPosition(t),s(this._nextPosition)===cc.p&&this._nextPosition.equals(t)||(this._nextPosition=t)},getNextPosition:function(){return this._nextPosition},setNextPosition:function(t){this._nextPosition=t},getVector:function(){return this._vector},setVector:function(t){this._vector=t},init:function(t){}}),cc._RF.pop()},{}],GameConfig:[function(t,e,i){"use strict";var s;function o(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}cc._RF.push(e,"112bciX0nVJy5Ulr8zmNmlJ","GameConfig"),cc.Class({extends:cc.Component,properties:(s={player_level:null,DEBUG:!0,max_puck_speed:3600,puck_speed_dampening:.6,puck_friction:.1,restitution:1,min_strike_speed:500,striker_touch_offset:40,aiStriker_max_speed:800,goals_to_win:5,ads_hour:24,ads_limit:100,ads_lives:1,variant_sponsored:0,variant_adPerGamesPlayed:1,difficulty:null},o(s,"player_level",0),o(s,"tag_puck",1),o(s,"tag_striker",2),s),onLoad:function(){this.init()},start:function(){},init:function(){this.player_level=Array();for(var t=1,e=2,i=0;i<150;i++)this.player_level[i]=t,(i+1)%3==0&&e<12&&e++,t+=e;this.difficulty=[{difficulty_level:0,starting_speed:.5,speed_mul:1,min_dist:1.5,color:"puck-white",rgb:new cc.Color(255,255,255)},{difficulty_level:1,starting_speed:.75,speed_mul:1,min_dist:1.3,color:"puck-white",rgb:new cc.Color(255,255,255)},{difficulty_level:5,starting_speed:.9,speed_mul:1,min_dist:1.1,color:"puck-yellow",rgb:new cc.Color(255,255,0)},{difficulty_level:10,starting_speed:1,speed_mul:1.025,min_dist:.75,color:"puck-pink",rgb:new cc.Color(328,55,99)},{difficulty_level:15,starting_speed:1,speed_mul:1.015,min_dist:.5,color:"puck-turq",rgb:new cc.Color(17,226,251)},{difficulty_level:25,starting_speed:1,speed_mul:1.01,min_dist:.05,color:"puck-purple",rgb:new cc.Color(161,54,22)}]}}),cc._RF.pop()},{}],Game:[function(t,e,i){"use strict";cc._RF.push(e,"57bcdzi/FhFWqRYrCsCjlQI","Game");cc.Class({extends:cc.Component,properties:{colors:null,visibleSize:null,origin:null,goalAnim:null,triangleAnim:null,dotHuman:{default:null,type:cc.Node},dotBot:{default:null,type:cc.Node},playerBot:{default:null,type:cc.Node},playerHuman:{default:null,type:cc.Node},arrPlayers:[],sprGetReady:{default:null,type:cc.Node},sprGoal:{default:null,type:cc.Node},sprResult:{default:null,type:cc.Node},stageArea:{default:null,type:cc.Node},ball:{default:null,type:cc.Node},ballTail:{default:null,type:cc.Node},homeNode:{default:null,serializable:!1},lblCurLevel:cc.Label,lblHumanScore:cc.Label,lblBotScore:cc.Label,lblLeftGoals:cc.Label,sndShoot:{default:null,type:cc.AudioClip},sndWall1:{default:null,type:cc.AudioClip},sndWall2:{default:null,type:cc.AudioClip},sndWall3:{default:null,type:cc.AudioClip},sndScoreBot:{default:null,type:cc.AudioClip},sndScorePlayer:{default:null,type:cc.AudioClip},sndPuckSet:{default:null,type:cc.AudioClip},bound_right:null,bound_left:null,bound_bottom:null,bound_top:null},onLoad:function(){this.colors=[cc.color(255,0,0),cc.color(0,255,0),cc.color(0,0,255),cc.color(255,0,228),cc.color(255,255,0),cc.color(255,108,0),cc.color(182,100,100),cc.color(192,100,100),cc.color(277,110,110)],this.visibleSize=this.node.getBoundingBox(),this.goalAnim=cc.sequence(cc.spawn(cc.scaleTo(.5,1,1).easing(cc.easeBounceOut()),cc.fadeIn(.3)),cc.delayTime(.5),cc.spawn(cc.fadeOut(1),cc.scaleTo(1,1.2,1.2).easing(cc.easeOut(.3)))),this.triangleAnim=cc.spawn(cc.sequence(cc.fadeIn(.1),cc.delayTime(1.5),cc.fadeOut(.4)),cc.rotateBy(2+2*Math.random(),30,30)),this.bound_left=new cc.Rect(-308,-537,2,1120),this.bound_right=new cc.Rect(306,-537,2,1120),this.bound_bottom=new cc.Rect(-307,-537,615,2),this.bound_top=new cc.Rect(-307,537,615,2),this.ball.getComponent("Ball").gameInstance=this,this.arrPlayers[0]=this.playerHuman,this.arrPlayers[1]=this.playerBot,this.stageArea=this.stageArea.getBoundingBox(),cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this),cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved,this),cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded,this),cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded,this)},start:function(){},update:function(t){var e=this.ball.getComponent("Ball"),i=e._nextPosition,s=e._vector;s.x=.98*s.x,s.y=.98*s.y,i.x+=s.x,i.y+=s.y;var o=Math.pow(this.arrPlayers[0].getComponent("PlayerHuman").Radius+e.Radius,2);for(var a in this.arrPlayers){var n,c,l=this.arrPlayers[a],r=null;r=0==a?l.getComponent("PlayerHuman"):l.getComponent("PlayerBot"),o=Math.pow(r.Radius+e.Radius,2),n=r._nextPosition,c=r._vector;var h=i.x-l.x,u=i.y-l.y,d=Math.pow(h,2)+Math.pow(u,2),g=Math.pow(this.ball.x-n.x,2)+Math.pow(this.ball.y-n.y,2);if(d<=o||g<=o){var p=Math.pow(s.x,2)+Math.pow(s.y,2),y=Math.pow(c.x,2)+Math.pow(c.y,2),b=Math.sqrt(p+y);b>50&&(b=50);var m=Math.atan2(u,h);s.x=b*Math.cos(m),s.y=b*Math.sin(m),i.x=n.x+(r.Radius+e.Radius+b)*Math.cos(m),i.y=n.y+(r.Radius+e.Radius+b)*Math.sin(m),cc.audioEngine.play(this.sndShoot,!1,1)}Math.pow(l.x-this.ball.x,2),Math.pow(l.y-this.ball.y,2),Math.pow(r.radius()+e.radius(),2)}if(i.x<this.stageArea.x+e.Radius&&(i.x=this.stageArea.x+e.Radius,s.x*=-.8,this.ball.y>this.stageArea.y+this.stageArea.height-260?this.onContactWall(4,this.ball.getPosition()):this.ball.y<this.stageArea.y+260?this.onContactWall(5,this.ball.getPosition()):this.onContactWall(6,this.ball.getPosition())),i.x>this.stageArea.x+this.stageArea.width-e.Radius&&(i.x=this.stageArea.x+this.stageArea.width-e.Radius,s.x*=-.8,this.ball.y>this.stageArea.y+this.stageArea.height-260?this.onContactWall(1,this.ball.getPosition()):this.ball.y<this.stageArea.y+260?this.onContactWall(2,this.ball.getPosition()):this.onContactWall(3,this.ball.getPosition())),i.y<this.stageArea.y+e.Radius&&(this.ball.x<this.visibleSize.width/2-110+e.Radius||this.ball.x>this.visibleSize.width/2+110-e.Radius)&&(i.y=this.stageArea.y+e.Radius,s.y*=-.8,this.ball.x<this.visibleSize.width/2?this.onContactWall(10,this.ball.getPosition()):this.ball.x>this.visibleSize.width/2&&this.onContactWall(9,this.ball.getPosition())),i.y>this.stageArea.y+this.stageArea.height-e.Radius&&(this.ball.x<this.visibleSize.width/2-110+e.Radius||this.ball.x>this.visibleSize.width/2+110-e.Radius)&&(i.y=this.stageArea.y+this.stageArea.height-e.Radius,s.y*=-.8,this.ball.x<this.visibleSize.width/2?this.onContactWall(8,this.ball.getPosition()):this.ball.x>this.visibleSize.width/2&&this.onContactWall(7,this.ball.getPosition())),e.setVector(s),e.setNextPosition(i),i.y<this.stageArea.y+e.Radius){var f=i.x-this.playerHuman.getPosition().x;Math.abs(f)<this.playerHuman.width/2+this.ball.width/2&&this.ball.getPosition().y>this.playerHuman.getPosition().y?(i.y=this.playerHuman.getPosition().y+this.playerHuman.height/2,f>0?i.x+=440/3:i.x-=440/3,s.x-=5*Math.random()):this.playerScore(1)}if(i.y>this.stageArea.y+this.stageArea.height-e.Radius){f=i.x-this.playerBot.getPosition().x;Math.abs(f)<this.playerBot.width/2+this.ball.width/2&&this.ball.getPosition().y<this.playerBot.getPosition().y?(i.y=this.playerBot.getPosition().y-this.playerBot.height/2,f>0?i.x+=440/3:i.x-=440/3,s.x-=5*Math.random()):this.playerScore(2)}this.arrPlayers[0].getComponent("PlayerHuman").setPlayerPosition(this.arrPlayers[0].getComponent("PlayerHuman")._nextPosition),e.setBallPosition(e._nextPosition),this.updateTail(),this.arrPlayers[1].getComponent("PlayerBot").handleProcess(this.stageArea,this.ball,t)},playerScore:function(t){switch(this.arrPlayers[0].getComponent("PlayerHuman").reset(this.stageArea),this.arrPlayers[0].getComponent("PlayerHuman").setTouch(null),this.arrPlayers[0].getComponent("PlayerHuman").setVector(cc.v2(0,0)),this.arrPlayers[1].getComponent("PlayerBot").reset(this.stageArea),this.arrPlayers[1].getComponent("PlayerBot").setTouch(null),this.arrPlayers[1].getComponent("PlayerBot").setVector(cc.v2(0,0)),this.sprGoal.stopAllActions(),this.sprResult.stopAllActions(),this.sprGoal.runAction(this.goalAnim),this.sprResult.runAction(this.triangleAnim),t){case 1:this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width/2,this.stageArea.y+this.stageArea.height/2-130)),this.dotAnim(this.dotHuman),this.homeNode.botScore+=1,cc.audioEngine.play(this.sndWall3,!1,1),cc.audioEngine.play(this.sndScoreBot,!1,1);break;case 2:this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width/2,this.stageArea.y+this.stageArea.height/2+130)),this.dotAnim(this.dotBot),this.homeNode.humanScore+=1,cc.audioEngine.play(this.sndWall1,!1,1),cc.audioEngine.play(this.sndScorePlayer,!1,1);break;default:this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width/2,this.stageArea.y+this.stageArea.height/2))}this.ball.getComponent("Ball").setVector(cc.v2(0,0)),this.resetTail(),this.updateLabels(),this.isMatchFinish()&&this.homeNode.onFinal()},onTouchBegan:function(t){var e=t.touch.getLocation();for(var i in this.arrPlayers){var s=this.arrPlayers[i],o=null;o=0==i?s.getComponent("PlayerHuman"):s.getComponent("PlayerBot"),s.getBoundingBox().contains(e.sub(cc.v2(375,667)))&&o.setTouch(t.touch)}},onTouchMoved:function(t){var e=t.touch.getLocation();for(var i in this.arrPlayers){var s=this.arrPlayers[i],o=null;if((o=0==i?s.getComponent("PlayerHuman"):s.getComponent("PlayerBot")).getTouch()===t.touch){var a=e.sub(cc.v2(375,667));a.x<this.stageArea.x+o.Radius&&(a.x=this.stageArea.x+o.Radius),a.x>this.stageArea.x+this.stageArea.width-o.Radius&&(a.x=this.stageArea.x+this.stageArea.width-o.Radius),a.y<this.stageArea.y+o.Radius&&(a.y=this.stageArea.y+o.Radius),a.y>this.stageArea.y+this.stageArea.height-o.Radius&&(a.y=this.stageArea.y+this.stageArea.height-o.Radius),s.y<this.stageArea.y+.5*this.stageArea.height?a.y>this.stageArea.y+.5*this.stageArea.height-o.Radius&&(a.y=this.stageArea.y+.5*this.stageArea.height-o.Radius):a.y<this.stageArea.y+.5*this.stageArea.height+o.Radius&&(a.y=this.stageArea.y+.5*this.stageArea.height+o.Radius),Math.pow(s.x-this.ball.x,2)+Math.pow(s.y-this.ball.y,2)<Math.pow(o.Radius+this.ball.getComponent("Ball").Radius,2)&&(this.ball.x<s.x?s.x+=10:this.ball.x>s.x?s.x-=10:this.ball.y<s.y?s.y+=10:this.ball.y>s.y&&(s.x-=10),a=s.getPosition()),o.setNextPosition(a),o.setVector(e.sub(cc.v2(375,667)).sub(s.getPosition()))}}},onTouchEnded:function(t){var e=t.touch;for(var i in this.arrPlayers){var s=this.arrPlayers[i],o=null;(o=0==i?s.getComponent("PlayerHuman"):s.getComponent("PlayerBot")).getTouch()===e&&(o.setTouch(null),o.setVector(cc.v2(0,0)))}},isMatchFinish:function(){return this.homeNode.humanScore>=5||this.homeNode.botScore>=5},resetTail:function(){null!=this.ballTail&&(this.ballTail.opacity=0,this.ballTail.scaleX=0)},updateTail:function(t){if(null!=this.ballTail){var e=cc.v2(this.ball.getComponent("Ball")._vector.x,this.ball.getComponent("Ball")._vector.y);e.x*=-1;var i=0===e.x||0===e.y?0:cc.v2(1,0).signAngle(e);this.ballTail.rotation=cc.misc.radiansToDegrees(i);var s=e.mag();40<s&&(s=40);var o=s/40;if(0<e.mag()){var a=o*this.ball.getComponent("Ball").Radius,n=this.ballTail.getPosition().add(e.normalize().mul(a));if(n.x>this.stageArea.x+this.stageArea.width){var c=cc.v2(this.stageArea.x+this.stageArea.width,this.stageArea.y),l=cc.v2(this.stageArea.x+this.stageArea.width,this.stageArea.y+this.stageArea.height);n=cc.pIntersectPoint(this.ballTail.getPosition(),n,c,l)}else n.x<this.stageArea.x&&(c=cc.v2(this.stageArea.x,this.stageArea.y),l=cc.v2(this.stageArea.x,this.stageArea.y+this.stageArea.height),n=cc.pIntersectPoint(this.ballTail.getPosition(),n,c,l));n.y>this.stageArea.y+this.stageArea.height&&(c=cc.v2(this.stageArea.x,this.stageArea.y+this.stageArea.height),l=cc.v2(this.stageArea.x+this.stageArea.width,this.stageArea.y+this.stageArea.height),n=cc.pIntersectPoint(this.ballTail.getPosition(),n,c,l)),n.y<this.stageArea.y&&(c=cc.v2(this.stageArea.x,this.stageArea.y),l=cc.v2(this.stageArea.x+this.stageArea.width,this.stageArea.y),n=cc.pIntersectPoint(this.ballTail.getPosition(),n,c,l));var r=n.sub(this.ballTail.getPosition());o=cc.v2(r.x,r.y).mag()/e.normalize().mul(a).mag()*o}this.ballTail.scaleX>o?this.ballTail.scaleX=cc.misc.clampf(this.ballTail.scaleX-.5*t,0,o):this.ballTail.scaleX<o&&(this.ballTail.scaleX=cc.misc.clampf(this.ballTail.scaleX+1.5*t,0,o)),this.ballTail.opacity=255*o}},onContactWall:function(t,e){cc.audioEngine.play(this.sndWall2,!1,1)},dotAnim:function(t){if(null!=t){this.schedule(function(){var e=this.colors.length;t.color=this.colors[Math.floor(Math.random()*e)],0},.18,10,0)}},updateLabels:function(){this.lblCurLevel.string=this.homeNode.currentLevel.toString(),this.lblHumanScore.string=this.homeNode.humanScore.toString(),this.lblBotScore.string=this.homeNode.botScore.toString(),this.lblLeftGoals.string=(5-this.homeNode.humanScore).toString()}}),cc._RF.pop()},{}],Home:[function(t,e,i){"use strict";cc._RF.push(e,"a705e5ivmdCXarirSEqWltl","Home"),cc.Class({extends:cc.Component,properties:{btnFav:cc.Button,btnSettings:cc.Button,btnRank:cc.Button,btnPlay:cc.Button,btnInvite:cc.Button,btnBack:cc.Button,btnLobbyBack:cc.Button,lblScore:cc.Label,lblCurrentScoreLevel:cc.Label,sprLogo:cc.Node,gameScene:cc.Node,finalNode:cc.Node,sndGameStart:{default:null,type:cc.AudioClip},humanScore:0,botScore:0,currentLevel:0,lblHumanScore:cc.Label,lblBotScore:cc.Label,lblCurrentLevel:cc.Label,sprWin:cc.Node,sprLose:cc.Node,display:cc.Sprite},onLoad:function(){this.finalAppearAction=cc.spawn(cc.scaleTo(.5,1,1),cc.fadeTo(.5,255)),this.finalDisappearAction=cc.fadeTo(.3,0),this.lobbyAppearAction=cc.moveBy(1,cc.v2(0,-800)).easing(cc.easeElasticOut(.6)),this.lobbyDisappearAction=cc.moveBy(1,cc.v2(0,800)).easing(cc.easeElasticOut(.6)),this.lobbyDisableAction=this.disable,this.readyAppearAction=cc.sequence(cc.scaleTo(.3,1.3,1.3).easing(cc.easeBackOut()),cc.scaleTo(.3,1,1),cc.delayTime(.5),cc.scaleTo(.1,0,0)),this.gameScene.getComponent("Game").homeNode=this,this.sprLogo.runAction(cc.sequence(cc.moveBy(0,cc.v2(0,800)),this.lobbyAppearAction))},start:function(){this._isShow=!1,this.display.node.active=this._isShow,this.btnLobbyBack.node.active=!1,this.tex=new cc.Texture2D},_messageSharecanvas:function(t,e){var i=wx.getOpenDataContext();console.log("type = "+t),console.log("text = "+e),i.postMessage({type:t||"friends",text:e})},onClickLobbyBack:function(){this._isShow=!1,this.btnBack.node.active=!0,this.display.node.active=this._isShow},onClickSettings:function(){},onClickRanking:function(){this._isShow=!0,this._messageSharecanvas(),this.btnLobbyBack.node.active=!0,this.display.node.active=this._isShow,this.btnPlay.node.active=!1,this.btnInvite.node.active=!1,this.btnRank.node.active=!1,this.btnBack.node.active=!1},onClickPlay:function(){this.sprLogo.runAction(cc.spawn(this.lobbyDisappearAction,cc.callFunc(function(){this.node.active=!1,this.gameScene.active=!0,this.gameScene.getChildByName("SprGetReady").runAction(cc.scaleTo(0,0)),this.gameScene.getChildByName("SprGetReady").runAction(this.readyAppearAction),cc.audioEngine.play(this.sndGameStart,!1,1)},this)))},onClickInvite:function(){cc.log("\u70b9\u51fb\u5206\u4eab\u6309\u94ae"),cc.loader.loadRes("texture/share",function(t,e){wx.shareAppMessage({title:"Enjoy AirHockey!",imageUrl:e.url,success:function(t){console.log(t)},fail:function(t){console.log(t)}})})},onClickBack:function(){if(this._isShow)return this._isShow=!1,this.display.node.active=this._isShow,this.btnLobbyBack.node.active=!1,this.btnPlay.node.active=!0,this.btnInvite.node.active=!0,this.btnRank.node.active=!0,void(this.btnBack.node.active=!0);this.humanScore=0,this.botScore=0,this.currentLevel=0,this.finalNode.runAction(cc.sequence(this.finalDisappearAction,cc.callFunc(function(){this.btnFav.node.active=!0,this.btnSettings.node.active=!0,this.lblScore.node.active=!0,this.lblCurrentScoreLevel.node.active=!0,this.sprLogo.runAction(this.lobbyAppearAction)},this))),this.gameScene.getComponent("Game").updateLabels()},onFinal:function(){this.gameScene.active=!1,this.node.active=!0,this.btnFav.node.active=!1,this.btnSettings.node.active=!1,this.lblScore.node.active=!1,this.lblCurrentScoreLevel.node.active=!1,this.humanScore>this.botScore?(this.sprWin.active=!0,this.sprLose.active=!1,this.currentLevel+=1):(this.sprWin.active=!1,this.sprLose.active=!0),this.finalNode.runAction(cc.sequence(cc.scaleTo(0,.5),this.finalAppearAction)),this.lblScore.string=this.humanScore.toString(),this.lblHumanScore.string=this.humanScore.toString(),this.lblBotScore.string=this.botScore.toString(),this.lblCurrentLevel.string=this.currentLevel.toString(),this.humanScore=0,this.botScore=0,this.gameScene.getComponent("Game").updateLabels(),this._messageSharecanvas("updateMaxScore",""+this.currentLevel)},_updaetSubDomainCanvas:function(){if(this.tex){var t=wx.getOpenDataContext().canvas;this.tex.initWithElement(t),this.tex.handleLoadedTexture(),this.display.spriteFrame=new cc.SpriteFrame(this.tex)}},update:function(){this._updaetSubDomainCanvas()}}),cc._RF.pop()},{}],PlayerBot:[function(t,e,i){"use strict";cc._RF.push(e,"e1095rvAV9OHpLlqVYFKVD0","PlayerBot");var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};cc.Class({extends:cc.Component,properties:{_nextPosition:null,_vector:null,_touch:null,_scoreValue:0,Radius:52},onLoad:function(){this._nextPosition=cc.v2(0,415),this._vector=cc.v2(0,0),this._touch=new cc.Touch},start:function(){},radius:function(){return this.Radius},center:function(){return this.node.position.add(this.circle.offset)},setPlayerPosition:function(t){this.node.setPosition(t),s(this._nextPosition)===cc.v2&&this._nextPosition.equals(t)||(this._nextPosition=t)},getNextPosition:function(){return this._nextPosition},setNextPosition:function(t){this._nextPosition=t},getVector:function(){return this._vector},setVector:function(t){this._vector=t},getTouch:function(){return this._touch},setTouch:function(t){this._touch=t},reset:function(t){this.setPlayerPosition(cc.v2(t.width/2+t.x,t.y+t.height-100)),this.hitTime=0,this.accumDt=0},hit:function(){this.hitTime=0},handleProcess:function(t,e,i){this.accumDt+=i;var s=this.node.getPosition(),o=e.getPosition();this._makeDecision(s.x,s.y,o.x,o.y,t,e);var a=this.node.getPosition();this.setVector(a.sub(s))},_makeDecision:function(t,e,i,s,o,a){return(i<o.x+o.width/5||i>o.x+4*o.width/5)&&s>o.y+o.height-2*a.getComponent("Ball").radius()?i<o.x+o.width/5?this._moveTo(t,e,i+a.getComponent("Ball").radius()/4,s,o,a):this._moveTo(t,e,i-a.getComponent("Ball").radius()/4,s,o,a):s>=o.y+o.height/2?this._moveTo(t,e,i,s-a.getComponent("Ball").radius()/4,o,a):this._defense(t,e,i,s,o,a)},_defense:function(t,e,i,s,o,a){return s>e&&Math.abs(i)>Math.abs(o.width/5)?this._moveTo(t,e,i,s+a.getComponent("Ball").radius,o,a):(this._moveTo(t,e,o.x+o.width/4+o.width/2*((i-o.x)/o.width),o.y+o.height-o.height/6,o,a),!0)},_moveTo:function(t,e,i,s,o,a){var n=o.width/(50+Math.floor(20*Math.random())),c=i-t,l=s-e,r=Math.sqrt(c*c+l*l);return r>n&&(i=t+n/r*c,s=e+n/r*l),this.setPlayerPosition(cc.v2(i,s)),!0}}),cc._RF.pop()},{}],PlayerHuman:[function(t,e,i){"use strict";cc._RF.push(e,"0ffb7T6MB1Nvqt32P1X6k8w","PlayerHuman");var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};cc.Class({extends:cc.Component,properties:{_nextPosition:null,_vector:null,_touch:null,_scoreValue:0,Radius:52},onLoad:function(){this._nextPosition=cc.v2(0,-505),this._vector=cc.v2(0,0),this._touch=new cc.Touch},start:function(){},radius:function(){return this.Radius},setPlayerPosition:function(t){this.node.setPosition(t),s(this._nextPosition)===cc.v2&&this._nextPosition.equals(t)||(this._nextPosition=t)},getNextPosition:function(){return this._nextPosition},setNextPosition:function(t){this._nextPosition=t},getVector:function(){return this._vector},setVector:function(t){this._vector=t},getTouch:function(){return this._touch},setTouch:function(t){this._touch=t},reset:function(t){this.setPlayerPosition(cc.v2(t.width/2+t.x,t.y+100)),this.hitTime=0,this.accumDt=0},hit:function(){this.hitTime=0}}),cc._RF.pop()},{}]},{},["Ball","Game","GameConfig","Home","PlayerBot","PlayerHuman"]);