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

    properties: {
        _nextPosition:  null,
        _vector:  null,
        _touch: null,
        _scoreValue: 0,
        Radius: 52
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._nextPosition = cc.v2(0, -505);
        this._vector = cc.v2(0, 0);
        this._touch = new cc.Touch();
    },

    start () {

    },

    // update (dt) {},

    radius: function () {
        return this.Radius;
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
        this.setPlayerPosition(cc.v2(stage.width / 2 + stage.x, stage.y + 100));

        // hit time (delay for repeated attack)
        this.hitTime = 0;
        this.accumDt = 0;
    },


    // called by Table when AI player hits a puck
    hit () {
        this.hitTime = 0;
    },
});
