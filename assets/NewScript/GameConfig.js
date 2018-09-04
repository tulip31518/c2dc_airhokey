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
        player_level: null,
        DEBUG: !0,
        max_puck_speed: 3600,
        puck_speed_dampening: .6,
        puck_friction: .1,
        restitution: 1,
        min_strike_speed: 500,
        striker_touch_offset: 40,
        aiStriker_max_speed: 800,
        goals_to_win: 5,
        ads_hour: 24,
        ads_limit: 100,
        ads_lives: 1,
        variant_sponsored: 0,
        variant_adPerGamesPlayed: 1,

        difficulty: null,
        
        player_level: 0,
        tag_puck: 1,
        tag_striker: 2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },

    start () {

    },

    // update (dt) {},
    
    init () {
        this.player_level = Array();
        for (var e = 1, t = 2, o = 0; o < 150; o++) {
            this.player_level[o] = e, (o + 1) % 3 == 0 && t < 12 && t++, e += t
        }

        this.difficulty = [{
            difficulty_level: 0,
            starting_speed: .5,
            speed_mul: 1,
            min_dist: 1.5,
            color: "puck-white",
            rgb: new cc.Color(255, 255, 255)
        },
        
        {
            difficulty_level: 1,
            starting_speed: .75,
            speed_mul: 1,
            min_dist: 1.3,
            color: "puck-white",
            rgb: new cc.Color(255, 255, 255)
        },
        
        {
            difficulty_level: 5,
            starting_speed: .9,
            speed_mul: 1,
            min_dist: 1.1,
            color: "puck-yellow",
            rgb: new cc.Color(255, 255, 0)
        },
        
        {
            difficulty_level: 10,
            starting_speed: 1,
            speed_mul: 1.025,
            min_dist: .75,
            color: "puck-pink",
            rgb: new cc.Color(328, 55, 99)
        },
        
        {
            difficulty_level: 15,
            starting_speed: 1,
            speed_mul: 1.015,
            min_dist: .5,
            color: "puck-turq",
            rgb: new cc.Color(17, 226, 251)
        },
        
        {
            difficulty_level: 25,
            starting_speed: 1,
            speed_mul: 1.01,
            min_dist: .05,
            color: "puck-purple",
            rgb: new cc.Color(161, 54, 22)
        }];
    }
});
