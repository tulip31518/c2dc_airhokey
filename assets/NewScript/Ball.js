// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    //gameConfig = require("./GameConfig"),
    //playerData = require("./PlayerData"),

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
        Radius: 30,
        
        _nextPosition: null,

        _vector: null,

        STATE_SHOW: 1,
        STATE_LIVE: 2,
        STATE_HIDE: 4,

        rigid: 0,
        circle: null,
        startPosition: null,
        state: 1,
        player_won_round: !1,
        tail: null,
        motionStreak: null,
        tailImage: null,
        overlapped_timer: 0,
        size: 1,
        lastVecNonZero: null,

        gameInstance: {
            default: null,
            serializable: false
        },

        gameConfig: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._nextPosition = cc.v2(0, -23);
        this._vector = cc.v2(0, 0);
        
        /*this.node.tag = this.gameConfig.tag_puck,
        this.circle = this.node.getComponent(cc.PhysicsCircleCollider),
        this.size = this.circle.radius

        this.startPosition = cc.Vec2.ZERO;
        this.lastVecNonZero = cc.Vec2.ZERO;

        this.init(this.node.getChildByName("nodeTrail"));*/
    },

    start () {
        /*this.rigid = this.node.getComponent(cc.RigidBody);
        this.rigid.linearDamping = 200;
        this.rigid.enabledContactListener = !0;
        this.rigid.fixedRotation = !0;
        this.rigid.awake = !0;
        this.rigid.allowSleep = !1;
        this.rigid.bullet = !0;
        this.rigid.angularDamping = 0;
        var phyCircleCollider = this.node.getComponent(cc.PhysicsCircleCollider);
        phyCircleCollider.density = .1;
        phyCircleCollider.tag = 125;
        
        phyCircleCollider.friction = 0.2;

        //(0 < c.default.ai_score || 0 < c.default.player_score) && (this.player_won_round = !!c.default.isPlayer, this.onNewRound())
        */
    },

    update (dt) {
        //this.state == this.STATE_SHOW ? this.changeState(this.STATE_LIVE) : (this.state = this.STATE_LIVE) || (this.state, this.STATE_HIDE)
    },

    onContacted () {
    },

    radius () {
        //radius of Ball(texAtlas-1-9.png)
        //return getTexture().getContentSize().width * 0.5;
        return this.Radius;
    },

    setBallPosition (pos) {
        this.node.setPosition(pos);

        if(typeof this._nextPosition !== cc.p || !this._nextPosition.equals(pos)) {
            this._nextPosition = pos;
        }
    },

    getNextPosition () {
        return this._nextPosition;
    },

    setNextPosition (vect) {
        this._nextPosition = vect;
    },

    getVector () {
        return this._vector;
    },

    setVector (vect) {
        this._vector = vect;
    },

    init (e) {
        //this.tail = e, this.tailImage = e.getChildByName("trail01"), this.resetTail()
    },
    
    /*updateTail (e) {
        if (null != this.tail) {
            console.log("UpdateTail: setPosition");
            this.tail.setPosition(this.node.getPosition().clone());
            var t = this.rigid.linearVelocity;
            t.x *= -1;
            var o = cc.pAngleSigned(new cc.Vec2(-1, 0), t);
            this.tail.rotation = cc.radiansToDegrees(o);
            var a = t.mag(), n = .5 * 600;
            n < a && (a = n);
            var i = a / n;
            if (0 < t.mag()) {
                var s = i * this.tailImage.getContentSize().height,
                    r = cc.pAdd(this.tail.getPosition(), t.normalize().mul(s));
                if (r.x > this.gameInstance.bound_right.x) {
                    var c = new cc.Vec2(this.gameInstance.bound_right.x, this.gameInstance.bound_bottom.y),
                        l = new cc.Vec2(this.gameInstance.bound_right.x, this.gameInstance.bound_top.y);
                    r = cc.pIntersectPoint(this.tail.getPosition(), r, c, l)
                } else if (r.x < this.gameInstance.bound_left.x) {
                    c = new cc.Vec2(this.gameInstance.bound_left.x, this.gameInstance.bound_bottom.y), l = new cc.Vec2(this.gameInstance.bound_left.x, this.gameInstance.bound_top.y);
                    r = cc.pIntersectPoint(this.tail.getPosition(), r, c, l)
                }
                if (r.y > this.gameInstance.bound_top.y) {
                    c = new cc.Vec2(this.gameInstance.bound_left.x, this.gameInstance.bound_top.y), l = new cc.Vec2(this.gameInstance.bound_right.x, this.gameInstance.bound_top.y);
                    r = cc.pIntersectPoint(this.tail.getPosition(), r, c, l)
                }
                if (r.y < this.gameInstance.bound_bottom.y) {
                    c = new cc.Vec2(this.gameInstance.bound_left.x, this.gameInstance.bound_bottom.y), l = new cc.Vec2(this.gameInstance.bound_right.x, this.gameInstance.bound_bottom.y);
                    r = cc.pIntersectPoint(this.tail.getPosition(), r, c, l)
                }
                i = cc.pSub(r, this.tail.getPosition()).mag() / t.normalize().mul(s).mag() * i
            }
            this.tail.scaleX > i ? this.tail.scaleX = cc.misc.clampf(this.tail.scaleX - .5 * e, 0, i) : this.tail.scaleX < i && (this.tail.scaleX = cc.misc.clampf(this.tail.scaleX + 1.5 * e, 0, i)), this.tailImage.opacity = 255 * i
        }
    },
    
    resetTail () {
        this.tailImage.opacity = 0,
        this.tail.scaleX = 0
    },
    
    lateUpdates (e) {
        //(this.state = a.STATE_LIVE) && (this.rigid.linearVelocity.mag() > d.default.max_puck_speed && (this.rigid.linearVelocity = cc.pMult(this.rigid.linearVelocity.normalize(), d.default.max_puck_speed)), (this.rigid.linearVelocity.x < -100 || 100 < this.rigid.linearVelocity.x) && (this.lastVecNonZero.x = this.rigid.linearVelocity.x), (this.rigid.linearVelocity.y < -100 || 100 < this.rigid.linearVelocity.y) && (this.lastVecNonZero.y = this.rigid.linearVelocity.y), this.updateTail(e), this.bounds(e))
        (this.state = 1) && (this.rigid.linearVelocity.mag() > 600 && (this.rigid.linearVelocity = cc.pMult(this.rigid.linearVelocity.normalize(), 600)),
        (this.rigid.linearVelocity.x < -100 || 100 < this.rigid.linearVelocity.x) && (this.lastVecNonZero.x = this.rigid.linearVelocity.x),
        (this.rigid.linearVelocity.y < -100 || 100 < this.rigid.linearVelocity.y) && (this.lastVecNonZero.y = this.rigid.linearVelocity.y),
        this.updateTail(e),
        this.bounds(e))
    },
    
    bounds (e) {
        var t = this.gameInstance.canvas,o = this.size;
        this.node.getPosition().x > .5 * t.width - o ? this.node.setPositionX(.5 * t.width - o) : this.node.getPosition().x < -(.5 * t.width + o) && (this.node.setPositionX(.5 * -t.width + o));
        this.node.getPosition().y > .5 * t.height - o ? this.node.setPositionY(.5 * t.height - o) : this.node.getPosition().y < .5 * -t.height + o && (this.node.setPositionY(.5 * -t.height + o));
    },
    
    changeState (e) {
        e == this.STATE_SHOW ? (this.node.active = !0, null != this.tail && (this.tail.active = !0)) : e == this.STATE_LIVE || e == this.STATE_HIDE && (this.rigid.linearVelocity = cc.Vec2.ZERO, this.node.active = !1, null != this.tail && (this.tail.active = !1)), this.state = e
    },
    
    onGoal (e) {
        this.rigid.linearVelocity = cc.Vec2.ZERO, this.player_won_round = e, this.rigid.linearVelocity = cc.Vec2.ZERO, this.changeState(a.STATE_HIDE)
    },
    
    onNewRound () {
        this.rigid.linearVelocity = cc.Vec2.ZERO;
        var e = this.startPosition.clone();
        this.player_won_round ? e.y += 1.2 * this.node.getContentSize().height : e.y -= 1.2 * this.node.getContentSize().height;
        console.log("onNewRound: setPosition 1");
        this.node.setPosition(e);
        console.log("onNewRound: setPosition 2");
        this.tail.setPosition(e);
        console.log("onNewRound: setPosition 3");
        this.resetTail();
        console.log("onNewRound: setPosition 4");
        this.changeState(this.STATE_SHOW);
        console.log("onNewRound: setPosition 5");
    },
    
    setSprite (e) {
        var t = e.getComponent(cc.Sprite), o = this.getComponent(cc.Sprite);
        o.spriteFrame = t.spriteFrame, o.node.opacity = 255
    },
    
    onBeginContact (e, t, o) {
        this.resetTail();
        this.node.getContentSize().width;
        var a = e.getWorldManifold().points[0], n = (o.node, !1);
        if (o.name.startsWith("bound_right"))
            (i = this.gameInstance.goalEffects.kuang_hitRoot2.convertToNodeSpace(a)).y > this.gameInstance.bound_top.y ? this.gameInstance.goalEffects.showHitEffects(i, "right_up") : i.y < this.gameInstance.bound_bottom.y ? this.gameInstance.goalEffects.showHitEffects(i, "right_bottom") : this.gameInstance.goalEffects.showHitEffects(i, "right"), n = !0;
        else if (o.name.startsWith("bound_left")) {
            (i = this.gameInstance.goalEffects.kuang_hitRoot2.convertToNodeSpace(a)).y > this.gameInstance.bound_top.y ? this.gameInstance.goalEffects.showHitEffects(i, "left_up") : i.y < this.gameInstance.bound_bottom.y ? this.gameInstance.goalEffects.showHitEffects(i, "left_bottom") : this.gameInstance.goalEffects.showHitEffects(i, "left"), n = !0
        } else if (o.name.startsWith("bound_top")) {
            (i = this.gameInstance.goalEffects.kuang_hitRoot2.convertToNodeSpace(a)).x > this.gameInstance.bound_top.x ? this.gameInstance.goalEffects.showHitEffects(i, "top_right") : i.x < this.gameInstance.bound_top.x && this.gameInstance.goalEffects.showHitEffects(i, "top_left"), n = !0
        } else if (o.name.startsWith("bound_bottom")) {
            var i;
            (i = this.gameInstance.goalEffects.kuang_hitRoot2.convertToNodeSpace(a)).x > this.gameInstance.bound_bottom.x ? this.gameInstance.goalEffects.showHitEffects(i, "bottom_right") : i.x < this.gameInstance.bound_bottom.x && this.gameInstance.goalEffects.showHitEffects(i, "bottom_left"), n = !0
        }
        n && this.onLostVelocity();
        var s = this.rigid.linearVelocity.mag();
        //n ? 1500 < s ? r.default.Instance.playOnce("AirHockey_WallBounce_01") : 800 < s ? r.default.Instance.playOnce("AIrHockey_WallBounce_02") : r.default.Instance.playOnce("AirHockey_WallBounce_03") : r.default.Instance.playOnce("AIrHockey_Shoot")
    },
    
    onLostVelocity () {
        var e = this.rigid.linearVelocity.mag();
        if (-100 < this.rigid.linearVelocity.x && this.rigid.linearVelocity.x < 100) {
            var t = new cc.Vec2(this.lastVecNonZero.x, this.rigid.linearVelocity.y);
            this.rigid.linearVelocity = t.normalize().mul(e)
        }
        if (-100 < this.rigid.linearVelocity.y && this.rigid.linearVelocity.y < 100) {
            t = new cc.Vec2(this.rigid.linearVelocity.x, this.lastVecNonZero.y);
            this.rigid.linearVelocity = t.normalize().mul(e)
        }
    }*/
});