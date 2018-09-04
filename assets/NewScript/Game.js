// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GOAL_WIDTH = 220;
var GOALS_TO_WIN = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        
        colors: null,
        visibleSize : null,
        origin : null,

        goalAnim: null,
        triangleAnim: null,
    
        dotHuman: {
            default: null,
            type: cc.Node
        },

        dotBot: {
            default: null,
            type: cc.Node
        },

        playerBot: {
            default: null,
            type: cc.Node
        },

        playerHuman: {
            default: null,
            type: cc.Node
        },

        arrPlayers: [],
    
        sprGetReady: {
            default: null,
            type: cc.Node
        },
        sprGoal: {
            default: null,
            type: cc.Node
        },
        sprResult: {
            default: null,
            type: cc.Node
        },

        stageArea: {
            default: null,
            type: cc.Node
        },

        ball: {
            default: null,
            type: cc.Node
        },

        ballTail: {
            default: null,
            type: cc.Node
        },

        homeNode: {
            default: null,
            serializable: false
        },

        lblCurLevel: cc.Label,
        lblHumanScore: cc.Label,
        lblBotScore: cc.Label,
        lblLeftGoals: cc.Label,

        sndShoot: cc.AudioClip,
        sndWall1: cc.AudioClip,
        sndWall2: cc.AudioClip,
        sndWall3: cc.AudioClip,
        sndScoreBot: cc.AudioClip,
        sndScorePlayer: cc.AudioClip,
        sndPuckSet: cc.AudioClip,

        bound_right: null,
        bound_left: null,
        bound_bottom: null,
        bound_top: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.colors = [
            cc.color(255, 0, 0),
            cc.color(0, 255, 0),
            cc.color(0, 0, 255),
            cc.color(255, 0, 228),
            cc.color(255, 255, 0),
            cc.color(255, 108, 0),
            cc.color(182, 100, 100),
            cc.color(192, 100, 100),
            cc.color(277, 110, 110)
        ];

        this.visibleSize = this.node.getBoundingBox();//new cc.Size(0, 0, 750, 1334);// cc.director.getVisibleSize();
        //this.origin = cc.director.getVisibleOrigin();
        
        this.goalAnim = cc.sequence(cc.spawn(cc.scaleTo(0.5, 1, 1).easing(cc.easeBounceOut()), cc.fadeIn(0.3)), cc.delayTime(0.5), cc.spawn(cc.fadeOut(1), cc.scaleTo(1, 1.2, 1.2).easing(cc.easeOut(0.3))));
        this.triangleAnim = cc.spawn(cc.sequence(cc.fadeIn(.1), cc.delayTime(1.5), cc.fadeOut(.4)), cc.rotateBy(2 + 2 * Math.random(), 30, 30));

        this.bound_left = new cc.Rect(-308, -537, 2, 1120);
        this.bound_right = new cc.Rect(306, -537, 2, 1120);
        this.bound_bottom = new cc.Rect(-307, -537, 615, 2);
        this.bound_top = new cc.Rect(-307, 537, 615, 2);

        //this.ball = this.ball.getComponent("Ball");
        this.ball.getComponent("Ball").gameInstance = this;
        
        this.arrPlayers[0] = this.playerHuman;
        this.arrPlayers[1] = this.playerBot;

        this.stageArea = this.stageArea.getBoundingBox();
        
        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded, this);
    },

    start () {
    },

    update (dt) {
        var ballObj = this.ball.getComponent("Ball");
        var ballNextPosition = ballObj._nextPosition;
        var ballVector = ballObj._vector;

        ballVector.x = ballVector.x * 0.98;
        ballVector.y = ballVector.y * 0.98;
        ballNextPosition.x += ballVector.x;
        ballNextPosition.y += ballVector.y;

        var squared_radii = Math.pow(this.arrPlayers[0].getComponent("PlayerHuman").Radius + ballObj.Radius, 2);

        for(var key in this.arrPlayers){
            var player = this.arrPlayers[key];
            var playerObj = null;

            var playerNextPosition = null;
            var playerVector = null;

            if(key == 0) {
                playerObj = player.getComponent("PlayerHuman");
            }
            else{
                playerObj = player.getComponent("PlayerBot");
            }

            squared_radii = Math.pow(playerObj.Radius + ballObj.Radius, 2);

            playerNextPosition = playerObj._nextPosition;
            playerVector = playerObj._vector;

            var diffx = ballNextPosition.x - player.x;
            var diffy = ballNextPosition.y - player.y;

            //distance between next ball position and current player position.
            var distance1 =  Math.pow(diffx, 2) + Math.pow(diffy, 2);

            //distance between current ball position and next player position.
            var distance2 = Math.pow(this.ball.x - playerNextPosition.x, 2) + Math.pow(this.ball.y - playerNextPosition.y, 2);

            if(distance1 <= squared_radii || distance2 <= squared_radii) {
                var mag_ball = Math.pow(ballVector.x, 2) + Math.pow(ballVector.y, 2);
                var mag_player = Math.pow(playerVector.x, 2) + Math.pow(playerVector.y, 2);
                var force = Math.sqrt(mag_ball + mag_player);
                if(force > 50)
                    force = 50;
                var angle = Math.atan2(diffy, diffx);

                ballVector.x = force * Math.cos(angle);
                ballVector.y = force * Math.sin(angle);

                ballNextPosition.x = playerNextPosition.x + (playerObj.Radius + ballObj.Radius + force) * Math.cos(angle);
                ballNextPosition.y = playerNextPosition.y + (playerObj.Radius + ballObj.Radius + force) * Math.sin(angle);

                cc.audioEngine.play(this.sndShoot, false, 1);
            }

            if(Math.pow(player.x - this.ball.x, 2) + Math.pow(player.y - this.ball.y, 2) < Math.pow(playerObj.radius() + ballObj.radius(), 2))
            {
                //if(key == 0){
                    // playerObj.setNextPosition(player.getPosition());
                //}
                //else{
                //    playerObj.setNextPosition(player.getPosition() + player.getPosition() - this.ball.getPosition());
                //}
            }
        }

        if(ballNextPosition.x < this.stageArea.x + ballObj.Radius) {
            ballNextPosition.x = this.stageArea.x + ballObj.Radius;
            ballVector.x *= -0.8;

            if(this.ball.y > this.stageArea.y + this.stageArea.height - 260) this.onContactWall(4, this.ball.getPosition());
            else if(this.ball.y < this.stageArea.y + 260) this.onContactWall(5, this.ball.getPosition());
            else this.onContactWall(6, this.ball.getPosition());
        }

        if(ballNextPosition.x > this.stageArea.x + this.stageArea.width - ballObj.Radius) {
            ballNextPosition.x = this.stageArea.x + this.stageArea.width - ballObj.Radius;
            ballVector.x *= -0.8;

            if(this.ball.y > this.stageArea.y + this.stageArea.height - 260) this.onContactWall(1, this.ball.getPosition());
            else if(this.ball.y < this.stageArea.y + 260) this.onContactWall(2, this.ball.getPosition());
            else this.onContactWall(3, this.ball.getPosition());
        }

        if(ballNextPosition.y < this.stageArea.y + ballObj.Radius) {
            if(this.ball.x < this.visibleSize.width / 2 - GOAL_WIDTH / 2 + ballObj.Radius|| this.ball.x > this.visibleSize.width / 2 + GOAL_WIDTH / 2 - ballObj.Radius) {
                ballNextPosition.y = this.stageArea.y + ballObj.Radius;
                ballVector.y *= -0.8;

                if(this.ball.x < this.visibleSize.width / 2) this.onContactWall(10, this.ball.getPosition());
                else if(this.ball.x > this.visibleSize.width / 2) this.onContactWall(9, this.ball.getPosition());
            }
        }

        if (ballNextPosition.y > this.stageArea.y + this.stageArea.height - ballObj.Radius) {
            if (this.ball.x < this.visibleSize.width / 2 - GOAL_WIDTH / 2 + ballObj.Radius || this.ball.x > this.visibleSize.width / 2 + GOAL_WIDTH / 2 - ballObj.Radius) {
                ballNextPosition.y = this.stageArea.y + this.stageArea.height - ballObj.Radius;
                ballVector.y *= -0.8;

                if(this.ball.x < this.visibleSize.width / 2) this.onContactWall(8, this.ball.getPosition());
                else if(this.ball.x > this.visibleSize.width / 2) this.onContactWall(7, this.ball.getPosition());
            }
        }

        ballObj.setVector(ballVector);
        ballObj.setNextPosition(ballNextPosition);

        // check for goal
        // if(ballNextPosition.y < this.stageArea.y + ballObj.Radius) {
        //     this.playerScore(1);
        // }

        // if(ballNextPosition.y > this.stageArea.y + this.stageArea.height - ballObj.Radius) {
        //     this.playerScore(2);
        // }

        // check for goal
        if(ballNextPosition.y < this.stageArea.y + ballObj.Radius) 
        { 
            var dif = ballNextPosition.x - this.playerHuman.getPosition().x;
            cc.log(dif)  ;
            if( Math.abs(dif) < this.playerHuman.width / 2 + this.ball.width / 2 && this.ball.getPosition().y > this.playerHuman.getPosition().y)
            {
                ballNextPosition.y = this.playerHuman.getPosition().y + this.playerHuman.height / 2;
                if(dif > 0)
                    ballNextPosition.x += GOAL_WIDTH * 2 / 3 ;
                else
                    ballNextPosition.x -= GOAL_WIDTH * 2 / 3;  
                ballVector.x -= Math.random() * 5;                                  
            }
            else
                this.playerScore(1);
                
        }

        if(ballNextPosition.y > this.stageArea.y + this.stageArea.height - ballObj.Radius) 
        {
            var dif = ballNextPosition.x - this.playerBot.getPosition().x;    
            cc.log(dif)  ;
            if( Math.abs(dif) < this.playerBot.width / 2 + this.ball.width / 2 && this.ball.getPosition().y < this.playerBot.getPosition().y)
            {
                ballNextPosition.y = this.playerBot.getPosition().y - this.playerBot.height / 2;
                if(dif > 0)
                    ballNextPosition.x += GOAL_WIDTH * 2 / 3;
                else
                    ballNextPosition.x -= GOAL_WIDTH * 2 / 3;  
                ballVector.x -= Math.random() * 5;           
            }
            else
                this.playerScore(2);
        }
        
        this.arrPlayers[0].getComponent("PlayerHuman").setPlayerPosition(this.arrPlayers[0].getComponent("PlayerHuman")._nextPosition);
        //this.arrPlayers[1].getComponent("PlayerBot").setPlayerPosition(this.arrPlayers[1].getComponent("PlayerBot")._nextPosition);
        ballObj.setBallPosition(ballObj._nextPosition);

        this.updateTail();

        // simulate AI
        this.arrPlayers[1].getComponent("PlayerBot").handleProcess(this.stageArea, this.ball, dt);
    },

    playerScore: function (player) {
        this.arrPlayers[0].getComponent("PlayerHuman").reset(this.stageArea);
        this.arrPlayers[0].getComponent("PlayerHuman").setTouch(null);
        this.arrPlayers[0].getComponent("PlayerHuman").setVector(cc.v2(0, 0));
        this.arrPlayers[1].getComponent("PlayerBot").reset(this.stageArea);
        this.arrPlayers[1].getComponent("PlayerBot").setTouch(null);
        this.arrPlayers[1].getComponent("PlayerBot").setVector(cc.v2(0, 0));


        this.sprGoal.stopAllActions();
        this.sprResult.stopAllActions();
        this.sprGoal.runAction(this.goalAnim);
        this.sprResult.runAction(this.triangleAnim);

        switch (player) {
            case 1://human
                this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width / 2, this.stageArea.y + this.stageArea.height / 2 - 130));
                this.dotAnim(this.dotHuman);

                this.homeNode.botScore += 1;

                cc.audioEngine.play(this.sndWall3, false, 1);
                cc.audioEngine.play(this.sndScoreBot, false, 1);
                break;
            case 2://bot
                this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width / 2, this.stageArea.y + this.stageArea.height / 2 + 130));
                this.dotAnim(this.dotBot);

                this.homeNode.humanScore += 1;
                
                cc.audioEngine.play(this.sndWall1, false, 1);
                cc.audioEngine.play(this.sndScorePlayer, false, 1);
                break;
            default:
                this.ball.getComponent("Ball").setBallPosition(cc.v2(this.visibleSize.width / 2, this.stageArea.y + this.stageArea.height / 2));
                break;
        }
        this.ball.getComponent("Ball").setVector(cc.v2(0, 0));

        //this.ballTail.setPosition(cc.v2(this.visibleSize.width / 2, this.stageArea.y + this.stageArea.height / 2));
        //this.ballTail.setScaleY(0);

        this.resetTail();

        this.updateLabels();
        
        if(this.isMatchFinish()){
            this.homeNode.onFinal();
        }
    },
    
    onTouchBegan (event) {
        var tap = event.touch.getLocation();

        for (var pKey in this.arrPlayers) {
            var p = this.arrPlayers[pKey];
            var pObj = null;
            
            if(pKey == 0) {
                pObj = p.getComponent("PlayerHuman");
            }
            else {
                pObj = p.getComponent("PlayerBot");
            }

            if (p.getBoundingBox().contains(tap.sub(cc.v2(375, 667)))) {
                pObj.setTouch(event.touch);
            }
        }
    },

    onTouchMoved (event) {
        var tap = event.touch.getLocation();
        
        for (var pKey in this.arrPlayers) {
            var p = this.arrPlayers[pKey];
            var pObj = null;
            
            if(pKey == 0) {
                pObj = p.getComponent("PlayerHuman");
            }
            else {
                pObj = p.getComponent("PlayerBot");
            }

            if (pObj.getTouch() === event.touch) {
                var nextPosition = tap.sub(cc.v2(375, 667));

                // keep player inside screen
                if (nextPosition.x < this.stageArea.x + pObj.Radius) {
                    nextPosition.x = this.stageArea.x + pObj.Radius;
                }

                if (nextPosition.x > this.stageArea.x + this.stageArea.width - pObj.Radius) {
                    nextPosition.x = this.stageArea.x + this.stageArea.width - pObj.Radius;
                }

                if (nextPosition.y < this.stageArea.y + pObj.Radius) {
                    nextPosition.y = this.stageArea.y + pObj.Radius;
                }

                if (nextPosition.y > this.stageArea.y + this.stageArea.height - pObj.Radius) {
                    nextPosition.y = this.stageArea.y + this.stageArea.height - pObj.Radius;
                }

                // keep player inside it's court
                if (p.y < this.stageArea.y + this.stageArea.height * 0.5) {
                    if (nextPosition.y > this.stageArea.y + this.stageArea.height * 0.5 - pObj.Radius) {
                        nextPosition.y = this.stageArea.y + this.stageArea.height * 0.5 - pObj.Radius;
                    }
                } else {
                    if (nextPosition.y < this.stageArea.y + this.stageArea.height * 0.5 + pObj.Radius) {
                        nextPosition.y = this.stageArea.y + this.stageArea.height * 0.5 + pObj.Radius;
                    }
                }
                
                if(Math.pow(p.x - this.ball.x, 2) + Math.pow(p.y - this.ball.y, 2) < Math.pow(pObj.Radius + this.ball.getComponent("Ball").Radius, 2))
                {
                    if(this.ball.x < p.x)
                        p.x += 10;
                    else if(this.ball.x > p.x)
                        p.x -= 10;
                    else if(this.ball.y < p.y)
                        p.y += 10;
                    else if(this.ball.y > p.y)
                        p.x -= 10;
                    nextPosition = p.getPosition();
                }

                pObj.setNextPosition(nextPosition);
                pObj.setVector(tap.sub(cc.v2(375, 667)).sub(p.getPosition()));
            }
        }
    },

    onTouchEnded (event) {
        var touch = event.touch;
        for (var pKey in this.arrPlayers) {
            var p = this.arrPlayers[pKey];
            var pObj = null;
            
            if(pKey == 0) {
                pObj = p.getComponent("PlayerHuman");
            }
            else {
                pObj = p.getComponent("PlayerBot");
            }

            if (pObj.getTouch() === touch) {
                pObj.setTouch(null);
                pObj.setVector(cc.v2(0, 0));
            }
        }
    },

    isMatchFinish () {
        //return this.arrPlayers[0]._scoreValue >= GOALS_TO_WIN || this.arrPlayers[1]._scoreValue >= GOALS_TO_WIN;
        return this.homeNode.humanScore >= GOALS_TO_WIN || this.homeNode.botScore >= GOALS_TO_WIN;
    },

    resetTail () {
        if(this.ballTail == null) return;
        
        this.ballTail.opacity = 0;
        this.ballTail.scaleX = 0;
    },

    updateTail (delta) {
        if (null != this.ballTail) {
            //this.ballTail.position = this.ball.position;
            //this.ballTail.setPosition(this.ball.getPosition());
            var vector = cc.v2(this.ball.getComponent("Ball")._vector.x, this.ball.getComponent("Ball")._vector.y);
            vector.x *= -1;

            var angle = vector.x === 0 || vector.y === 0 ? 0.0 : cc.v2(1, 0).signAngle(vector);
            this.ballTail.rotation = cc.misc.radiansToDegrees(angle);
            var best_part_step_diff = vector.mag();

            //var tmp_step_diff = .5 * _deepAssign2.default.max_puck_speed;
            var tmp_step_diff = .5 * 80;
            if (tmp_step_diff < best_part_step_diff) {
                /** @type {number} */
                best_part_step_diff = tmp_step_diff;
            }
            /** @type {number} */
            var width = best_part_step_diff / tmp_step_diff;
            if (0 < vector.mag()) {
                /** @type {number} */
                var x = width * this.ball.getComponent("Ball").Radius;
                var loc = this.ballTail.getPosition().add(vector.normalize().mul(x));
                if (loc.x > this.stageArea.x + this.stageArea.width) {
                    var right_w = cc.v2(this.stageArea.x + this.stageArea.width, this.stageArea.y);
                    var bottom_h = cc.v2(this.stageArea.x + this.stageArea.width, this.stageArea.y + this.stageArea.height);
                    loc = cc.pIntersectPoint(this.ballTail.getPosition(), loc, right_w, bottom_h);
                } else {
                    if (loc.x < this.stageArea.x) {
                        right_w = cc.v2(this.stageArea.x, this.stageArea.y);
                        bottom_h = cc.v2(this.stageArea.x, this.stageArea.y + this.stageArea.height);
                        loc = cc.pIntersectPoint(this.ballTail.getPosition(), loc, right_w, bottom_h);
                    }
                }
                if (loc.y > this.stageArea.y + this.stageArea.height) {
                    right_w = cc.v2(this.stageArea.x, this.stageArea.y + this.stageArea.height);
                    bottom_h = cc.v2(this.stageArea.x + this.stageArea.width, this.stageArea.y + this.stageArea.height);
                    loc = cc.pIntersectPoint(this.ballTail.getPosition(), loc, right_w, bottom_h);
                }
                if (loc.y < this.stageArea.y) {
                    right_w = cc.v2(this.stageArea.x, this.stageArea.y);
                    bottom_h = cc.v2(this.stageArea.x + this.stageArea.width, this.stageArea.y);
                    loc = cc.pIntersectPoint(this.ballTail.getPosition(), loc, right_w, bottom_h);
                }

                var ccP = loc.sub(this.ballTail.getPosition());
                /** @type {number} */
                width = cc.v2(ccP.x, ccP.y).mag() / vector.normalize().mul(x).mag() * width;
            }
            if (this.ballTail.scaleX > width) {
                this.ballTail.scaleX = cc.misc.clampf(this.ballTail.scaleX - .5 * delta, 0, width);
            } else {
                if (this.ballTail.scaleX < width) {
                    this.ballTail.scaleX = cc.misc.clampf(this.ballTail.scaleX + 1.5 * delta, 0, width);
                }
            }

            /** @type {number} */
            this.ballTail.opacity = 255 * width;
        }
    },

    onContactWall (nCase, contactPosition) {
        cc.audioEngine.play(this.sndWall2, false, 1);
        return;
        var actNode = null;

        switch (nCase) {
            case 1://right_up
                actNode = this.nodeRightTop;
                break;
            case 2://right_bottom
                actNode = this.nodeRightBot;
                break;
            case 3://right
                actNode = this.nodeRightMid;
                actNode.y = contactPosition.y;
                break;
            case 4://left_up
                actNode = this.nodeLeftTop;
                break;
            case 5://left_bottom
                actNode = this.nodeLeftBot;
                break;
            case 6://left
                actNode = this.nodeLeftMid;
                actNode.y = contactPosition.y;
                break;
            case 7://top_right
                actNode = this.nodeRightTop;
                break;
            case 8://top_left
                actNode = this.nodeLeftTop;
                break;
            case 9://bottom_right
                actNode = this.nodeRightBot;
                break;
            case 10://bottom_left
                actNode = this.nodeLeftBot;
                break;
        }

        actNode.stopAllActions();

        var action = cc.sequence(cc.fadeIn(.1), cc.delayTime(.1), cc.fadeOut(.5));
        actNode.runAction(action);
    },

    dotAnim (whoseDot) {
        /*whoseDot.runAction(cc.repeat(cc.sequence(cc.callFunc(function () {
            var e = o.colors.length;

            t.color = o.colors[Math.floor(cc.random0To1() * e)], a++, t.opacity = 10 <= a ? 80 : 255
        }, this), cc.delayTime(0.18)), 10));*/

        if(whoseDot == null) return;

        var a = 0;
        this.schedule(function() {
            var e = this.colors.length;
            whoseDot.color = this.colors[Math.floor(Math.random() * e)],a++
            //whoseDot.opacity = (10 <= a ? 80 : 255);
        }, 0.18, 10, 0);
    },

    updateLabels () {
        this.lblCurLevel.string = this.homeNode.currentLevel.toString();
        this.lblHumanScore.string = this.homeNode.humanScore.toString();
        this.lblBotScore.string = this.homeNode.botScore.toString();
        this.lblLeftGoals.string = (5 - this.homeNode.humanScore).toString();
    }
});
