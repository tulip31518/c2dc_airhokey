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
        btnFav: cc.Button,
        btnSettings: cc.Button,
        btnRank: cc.Button,
        btnPlay: cc.Button,
        btnInvite: cc.Button,
        btnBack: cc.Button,
        btnLobbyBack: cc.Button,

        lblScore: cc.Label,
        lblCurrentScoreLevel: cc.Label,

        sprLogo: cc.Node,

        gameScene: cc.Node,
        finalNode: cc.Node,

        sndGameStart: cc.AudioClip,

        humanScore: 0,
        botScore: 0,
        currentLevel: 0,

        //final
        lblHumanScore: cc.Label,
        lblBotScore: cc.Label,
        lblCurrentLevel: cc.Label,
        sprWin: cc.Node,
        sprLose: cc.Node,

        // score node
        display: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.finalAppearAction = cc.spawn(cc.scaleTo(0.5, 1, 1), cc.fadeTo(0.5, 255));
        this.finalDisappearAction = cc.fadeTo(0.3, 0);
        this.lobbyAppearAction = cc.moveBy(1, cc.v2(0, -800)).easing(cc.easeElasticOut(0.6));
        this.lobbyDisappearAction = cc.moveBy(1, cc.v2(0, 800)).easing(cc.easeElasticOut(0.6));
        this.lobbyDisableAction = this.disable;
        this.readyAppearAction = cc.sequence(cc.scaleTo(.3, 1.3, 1.3).easing(cc.easeBackOut()), cc.scaleTo(.3, 1, 1), cc.delayTime(0.5), cc.scaleTo(0.1, 0, 0));

        this.gameScene.getComponent("Game").homeNode = this;

        //this.finalNode.cascadeOpacity = true;
        //this.finalNode.opacity = 0;
        //this.finalNode.active = true;
        
        this.sprLogo.runAction(cc.sequence(cc.moveBy(0, cc.v2(0, 800)), this.lobbyAppearAction));
    },

    start () {
        this._isShow = false;
        this.display.node.active = this._isShow;
        this.btnLobbyBack.node.active = false;
        this.tex = new cc.Texture2D();
    },

    _messageSharecanvas (type, text) {
        // 排行榜也应该是实时的，所以需要sharedCanvas 绘制新的排行榜
        let openDataContext = wx.getOpenDataContext();
        console.log('type = ' + type);
        console.log('text = ' + text);
        openDataContext.postMessage({
            type: type || 'friends',
            text: text,
        });
    },

    // _disableButtons () {
    //     this.btnPlay.Enabled = false;
    //     this.btnRank.Enabled = false;
    //     this.btnInvite.Enabled = false;
    // }

    // _enableButtons () {
    //     this.btnPlay.Enabled = true;
    //     this.btnRank.Enabled = true;
    //     this.btnInvite.Enabled = true;
    // }

    onClickLobbyBack () {
        this._isShow = false;
        this.btnBack.node.active = true;
        this.display.node.active = this._isShow;
    },

    onClickSettings () {
    },

    onClickRanking () {
        
        this._isShow = true;
        // 发消息给子域
        this._messageSharecanvas();
        this.btnLobbyBack.node.active = true;
        this.display.node.active = this._isShow;
        this.btnPlay.node.active = false;
        this.btnInvite.node.active = false;
        this.btnRank.node.active = false;
        this.btnBack.node.active = false;
        // this._disableButtons();
    },

    onClickPlay () {
        this.sprLogo.runAction(cc.spawn(this.lobbyDisappearAction, cc.callFunc(function () {
            this.node.active = false;
            this.gameScene.active = true;
            this.gameScene.getChildByName("SprGetReady").runAction(cc.scaleTo(0, 0));
            this.gameScene.getChildByName("SprGetReady").runAction(this.readyAppearAction);

            cc.audioEngine.play(this.sndGameStart, false, 1);
        }, this)));
    },

    onClickInvite () {
        //wx.shareAppMessage({title: "", imageUrl: ""});
        //分享按钮
        cc.log("点击分享按钮");
        //this.playBtnSound();
        
        // 主动拉起分享接口
        cc.loader.loadRes("texture/share",function(err,data){
            wx.shareAppMessage({
                title: "Enjoy AirHockey!",
                imageUrl: data.url,
                success(res){
                    console.log(res)
                },
                fail(res){
                    console.log(res)
                }
            })
        });      
    },

    onClickBack () {

        if (this._isShow) {
            this._isShow = false;
            this.display.node.active = this._isShow;
            this.btnLobbyBack.node.active = false;
            this.btnPlay.node.active = true;
            this.btnInvite.node.active = true;
            this.btnRank.node.active = true;
            this.btnBack.node.active = true;
            return;
        }

        this.humanScore = 0;
        this.botScore = 0;
        this.currentLevel = 0;

        this.finalNode.runAction(cc.sequence(this.finalDisappearAction, cc.callFunc(function () {
            this.btnFav.node.active = true;
            this.btnSettings.node.active = true;
            this.lblScore.node.active = true;
            this.lblCurrentScoreLevel.node.active = true;

            this.sprLogo.runAction(this.lobbyAppearAction);
        }, this)));

        this.gameScene.getComponent("Game").updateLabels();
    },
    
    onFinal () {
        this.gameScene.active = false;
        this.node.active = true;

        this.btnFav.node.active = false;
        this.btnSettings.node.active = false;
        this.lblScore.node.active = false;
        this.lblCurrentScoreLevel.node.active = false;

        if(this.humanScore > this.botScore) {
            this.sprWin.active = true;
            this.sprLose.active = false;
            this.currentLevel += 1;
        }
        else{
            this.sprWin.active = false;
            this.sprLose.active = true;
        }


        this.finalNode.runAction(cc.sequence(cc.scaleTo(0, 0.5), this.finalAppearAction));
        
        this.lblScore.string = this.humanScore.toString();
        this.lblHumanScore.string = this.humanScore.toString();
        this.lblBotScore.string = this.botScore.toString();
        this.lblCurrentLevel.string = this.currentLevel.toString();

        this.humanScore = 0;
        this.botScore = 0;

        this.gameScene.getComponent("Game").updateLabels();
        this._messageSharecanvas('updateMaxScore', '' + this.currentLevel);
    },

    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update () {
        this._updaetSubDomainCanvas();
    },
});