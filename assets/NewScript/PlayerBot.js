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

    //gameConfig: require("./GameConfig"),
    //ballObj: require("./Ball"),
    //playerData: require("./PlayerData"),

    properties: {
        _nextPosition:  null,
        _vector:  null,
        _touch: null,
        _scoreValue: 0,
        Radius: 52,

        /*targetPos: cc.Vec2.ZERO,
        targetDist: 0,
        targetVel: cc.Vec2.ZERO,
        move_speed: 500,
        player_goal_area: null,
        self_goal_area: null,
        left_area: null,
        right_area: null,
        top_area: null,
        center_area: null,
        ball: null,
        player_striker: null,
        state: 1,
        stay_timer: 0,
        stricke_timer: 0,
        circle: null,
        size: 1,
        motion: cc.Vec2.ZERO*/
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._nextPosition = cc.v2(0, 415);
        this._vector = cc.v2(0, 0);
        this._touch = new cc.Touch();
    },

    start () {

    },

    // update (dt) {},

    radius () {
        //radius of player(texAtlas-2-12.png)
        //return getTexture().getContentSize().width * 0.5;
        return this.Radius;
    },

    center () {
        return this.node.position.add(this.circle.offset)
    },

    setPlayerPosition (pos) {
        this.node.setPosition(pos);

        if(typeof this._nextPosition !== cc.v2 || !this._nextPosition.equals(pos)) {
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

    getTouch () { return this._touch; },

    setTouch (touch) { this._touch = touch; },

    // @region public functions
    // resets player instance
    reset (stage) {
        this.setPlayerPosition(cc.v2(stage.width / 2 + stage.x, stage.y + stage.height - 100));

        // hit time (delay for repeated attack)
        this.hitTime = 0;
        this.accumDt = 0;
    },


    // called by Table when AI player hits a puck
    hit () {
        this.hitTime = 0;
    },

    // called by Table object (onProcess)
    handleProcess (stage, puck, dt) {
        this.accumDt += dt;

        // get position of my paddle
        var pos = this.node.getPosition();

        // get position of puck
        var puckPos = puck.getPosition();

        // delay & defense after contact
        /*if (this.accumDt - this.hitTime < 300) {
            this._defense(pos.x, pos.y, puckPos.x, puckPos.y, stage, puck);
            return;
        }*/

        // otherwise make a desiciton
        this._makeDecision(pos.x, pos.y, puckPos.x, puckPos.y, stage, puck);

        var nextPos = this.node.getPosition();
        this.setVector(nextPos.sub(pos));
    },

    // @region private functions
    _makeDecision (x, y, px, py, stage, puck) {
        // attack when puck is in our corner
        var puckInCorner = px < stage.x + stage.width / 5 || px > stage.x + 4 * stage.width / 5;

        if (puckInCorner && py > stage.y + stage.height - puck.getComponent("Ball").radius() * 2) {
            //return;
            if(px < stage.x + stage.width / 5)
                return this._moveTo(x, y, px + puck.getComponent("Ball").radius() / 4, py, stage, puck);
            else
                return this._moveTo(x, y, px - puck.getComponent("Ball").radius() / 4, py, stage, puck);
        }

        // move to puck's position and hit puck to the second half of table
        if (py >= (stage.y + stage.height / 2))
        {
            return this._moveTo(x, y, px, py - puck.getComponent("Ball").radius() / 4, stage, puck);
        }

        return this._defense(x, y, px, py, stage, puck);
    },

    // simple defence method
    _defense (x, y, px, py, stage, puck) {
        if (py > y && Math.abs(px) > Math.abs(stage.width / 5))
            return this._moveTo(x, y, px, py + puck.getComponent("Ball").radius, stage, puck);

        this._moveTo(x, y, stage.x + stage.width / 4 + stage.width / 2 * ((px - stage.x) / stage.width), stage.y + stage.height - stage.height / 6, stage, puck);
        return true;
    },


    // calculates movement for AI paddle
    _moveTo (ox, oy, px, py, stage, puck) {
        // be random
        var speed = stage.width / (50.0 + Math.floor(Math.random() * 20));

        var oldpx = px;
        var oldpy = py;

        // calculate deltas
        var dx = px - ox;
        var dy = py - oy;

        // calculate distance between puck and paddle position (we use Pythagorean theorem)
        var distance = Math.sqrt(dx * dx + dy * dy);

        // if total distance is greater than the distance, of which we can move in one step calculate new x and y coordinates somewhere between current puck and paddle position.
        if (distance > speed) {
            // x = current padle x position + equally part of speed on x axis
            px = ox + speed / distance * dx;
            py = oy + speed / distance * dy;
        }

        /*if(Math.pow(oldpx - px, 2) + Math.pow(oldpy - py, 2) < this.radius() + puck.getComponent("Ball").radius()){
            px = ox;
            py = oy;
        }*/

        // move paddle to the new position
        this.setPlayerPosition(cc.v2(px, py));
        return true;
    }



    /*init () {
        this.rigid = this.node.getComponent(cc.RigidBody),
        this.rigid.awake = !0,
        this.rigid.allowSleep = !1,
        this.circle = this.node.getComponent(cc.PhysicsCircleCollider),
        this.size = this.circle.radius,
        this.last_position = this.node.position, this.changeState(1)
    },
    
    ResetPosition () {
        this.changeState(1), this.rigid.linearVelocity = cc.Vec2.ZERO;
        var e = .7 * (this.top_area.y - this.center_area.y),
            t = this.center_area.position.add(new cc.Vec2(0, e));
        this.node.position = t
    },
    
    changeState (e) {
        e == 1 ? (this.stricke_timer = 0, this.rigid.linearVelocity = cc.Vec2.ZERO, this.stay_timer = .5 + 1 * cc.random0To1()) : 2 == e ? (this.rigid.linearVelocity = cc.Vec2.ZERO, this.nextPos(2)) : 4 == e && (this.rigid.linearVelocity = cc.Vec2.ZERO, this.stricke_timer = 0), this.state = e
    },

    updateAIState () {
        if (this.ball.state != 1) this.state != 1 && this.changeState(1);
        else {
            var e = !1;
            this.ball.node.position.y > this.center_area.position.y && (e = !0),
            e ? 4 != this.state && this.stricke_timer <= 0 && this.changeState(4) : (this.stricke_timer = -1, 4 == this.state && this.changeState(2))
        }
    },
    
    doUpdate (e) {
        if (this.state == 1){
            this.stay_timer -= e,
            this.stay_timer <= 0 && this.changeState(2);
        }
        else if (2 == this.state){
            this.action_idle(e);
        }
        else if (4 == this.state)
            if (this.stricke_timer -= e, this.stricke_timer <= 0) {
                0 == (r = cc.pDistance(this.node.position, this.ball.node.position)) && (r = 1);
                var t = 3 * this.size / r, o = gameConfig.aiStriker_max_speed * t;

                var matchConfig = playerData.getDifficulty();

                o = cc.misc.clampf(o, .9 * gameConfig.aiStriker_max_speed, 1.5 * gameConfig.aiStriker_max_speed), this.move_speed = gameConfig.aiStriker_max_speed * matchConfig.speed_mul, this.move_speed *= matchConfig.starting_speed;
                this.top_area.y, this.center_area.y;
                if (this.ball.node.position.y >= this.node.position.y + this.ball.size && cc.pDistance(this.node.position, this.ball.node.position) > 5 * this.ball.size) {
                    var a = cc.Vec2.ZERO;
                    a = this.ball.node.position.x > d.default.Instance.bound_center.x ? new cc.Vec2(this.ball.node.position.x - 3 * this.size, .5 * (this.ball.node.position.y + this.node.position.y)) : new cc.Vec2(this.ball.node.position.x + 3 * this.size, .5 * (this.ball.node.position.y + this.node.position.y)), this.targetPos = this.bounds(a)
                } else if (0 == this.ball.rigid.linearVelocity.mag() && cc.pDistance(this.node.position, this.ball.node.position) > 7 * this.ball.size) {
                    a = cc.Vec2.ZERO;
                    a = this.ball.node.position.x > d.default.Instance.bound_center.x || .5 < cc.random0To1() && 0 == this.ball.node.position.x && 0 == this.node.position.x ? new cc.Vec2(this.ball.node.position.x - 1.5 * this.size, this.ball.node.position.y) : new cc.Vec2(this.ball.node.position.x + 1.5 * this.size, this.ball.node.position.y), this.targetPos = this.bounds(a)
                } else {
                    var n = this.player_goal_area.position.clone();
                    a = this.ball.node.position.sub(n);
                    this.targetPos = this.bounds(this.ball.node.position.add(a.normalize().mul(.7 * this.ball.node.getContentSize().width)))
                }
                if (cc.pDistance(this.targetPos, this.node.position) < 5) return void(this.motion = cc.Vec2.ZERO);
                var i = this.targetPos.sub(this.node.position);
                if (0 < i.mag()) {
                    i = i.normalize();
                    var s = this.node.position.add(i.mul(this.move_speed * e));
                    this.motion = s.sub(this.node.position);
                    var r = cc.pDistance(s, this.ball.center()),
                        c = .9 * (d.default.Instance.handle.size + this.ball.size);
                    r < c && (s = this.ball.center().add(cc.pSub(this.center(), this.ball.center()).normalize().mul(c))), this.node.setPosition(s)
                } else this.motion = cc.Vec2.ZERO;
                this.last_position = this.node.position
            } else this.action_idle(e);
        this.updateAIState();
    },
    
    lateUpdate (e) {
        this.motion = cc.Vec2.ZERO
    },

    nextPos (e) {
        var matchConfig = playerData.getDifficulty();

        var t = this.right_area.x - this.left_area.x, o = this.top_area.y - this.center_area.y;
        if (2 == e) {
            var a = this.self_goal_area.getPosition();
            a.y -= .3 * o * matchConfig.min_dist;
            var n = matchConfig.min_dist;
            a.x += .25 * t * n - cc.random0To1() * (.5 * t * n), a.y += cc.random0To1() * (.05 * o) - .025 * o, a.x < 0 ? a.x -= 10 : 0 < a.x && (a.x += 10), this.targetPos = this.bounds(a)
        } else if (3 == e) {
            var i = this.ball.getComponent(cc.RigidBody),
                s = cc.director.getPhysicsManager().rayCast(this.ball.node.position, this.ball.node.position.add(i.linearVelocity.mul(100)), cc.RayCastType.Closest);
            if (null != s && 0 < s.length) {
                var r = s[0].point;
                this.targetPos = this.bounds(this.ball.node.position.add(ballObj.sub(this.ball.node.position).mul(.8)))
            }
        } else 4 == e && (this.targetPos = this.bounds(this.ball.node.position));
        this.targetDist = cc.pDistance(this.targetPos, this.node.position), this.targetVel = cc.pSub(this.targetPos, this.node.position)
    },

    action_idle (e) {
      this.move_speed = 500, this.stricke_timer -= e;
      var t = cc.pSub(this.targetPos, this.node.position), o = t.mag() / this.targetDist;
      if (0 != (o = (t = t.normalize().mul(o * this.move_speed * e)).mag())) {
          o < .5 ? t = t.normalize().mul(.5) : 8 < o && (t = t.normalize().mul(8));
          var a = cc.pAdd(this.node.position, t);
          if (cc.pDistance(this.node.position, this.targetPos) < 5) this.changeState(u);
          else cc.pSub(a, this.node.position).dot(t) < 0 ? this.changeState(u) : this.node.setPosition(a)
      }
    },
    
    onMatchOver () {
        this.changeState(u)
    },
    
    ResetVelocity () {
      this.rigid.linearVelocity = cc.Vec2.ZERO
    },
    
    onPostSolve (e, t, o) {
      if (o.getComponent(cc.PhysicsCircleCollider).tag == gameConfig.tag_puck) {
            var a = o.node.getComponent(cc.RigidBody),
            n = a.getComponent("Ball"),
            i = this.motion.mul(80),
            s = i.mag();
            0 != s && (s > gameConfig.max_puck_speed ? i = cc.pMult(i.normalize(), gameConfig.max_puck_speed) : s < gameConfig.min_strike_speed && 0 < s && (i = cc.pMult(i.normalize(), gameConfig.min_strike_speed)), 0 < s && (a.linearVelocity = a.linearVelocity.add(i)), 4 == this.state && (n.center().x > d.default.Instance.bound_right.position.x - 2 * n.size || n.center().x < d.default.Instance.bound_left.position.x + 2 * n.size ? (this.nextPos(2), this.stricke_timer = 1.5) : -i.y > 2 * Math.abs(i.x) && (this.nextPos(2), this.stricke_timer = .25)))
        }
    },
    
    bounds () {
        var t = this.node.getComponent(cc.PhysicsCircleCollider);
        return this.node.x = cc.misc.clampf(e.x, this.left_area.position.x + (t.radius - t.offset.x), this.right_area.position.x - (t.radius + t.offset.x)),
        e.y = cc.misc.clampf(e.y, this.center_area.position.y + (t.radius - t.offset.y), this.top_area.position.y - (t.radius + t.offset.y))
    }*/
});
