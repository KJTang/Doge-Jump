import GameManager      from '../manager/game_manager'
import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'

import Logger           from '../base/logger'
import Vector2          from '../base/vector'
import Scene            from '../base/scene'
import Text             from '../base/text'
import Button           from '../base/button'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import RockCreator      from '../runtime/rock_creator'

let gm = GameManager.instance;

export default class PlayScene extends Scene {
    constructor() {
        super();

        // this.bg = new Background();
        // this.addChild(this.bg);

        this.levelTxt = new Text('level: 0', 100, "#000000", "bottom");
        this.addChild(this.levelTxt);
        this.levelTxt.pivot = new Vector2(0, 0);
        this.levelTxt.position = new Vector2(25, gm.designHeight * 0.95);

        this.scoreTxt = new Text('score: 0', 100, "#000000", "bottom");
        this.addChild(this.scoreTxt);
        this.scoreTxt.pivot = new Vector2(0, 0);
        this.scoreTxt.position = new Vector2(25, gm.designHeight * 0.90);

        this.rockCreator = new RockCreator();
        this.addChild(this.rockCreator);
        this.rockCreator.start();

        this.player = new Player(gm.designWidth * 0.3, gm.designHeight * 0.4);
        this.addChild(this.player);

        // // buttons
        // let jumpBtn = new Button('images/ui/BtnStartNormal.png', 'images/ui/BtnStartSelected.png', 128, 64, function(point) {
        //     this.player.jump();
        // }.bind(this));
        // jumpBtn.position = new Vector2(270, 100);
        // this.addChild(jumpBtn);

        // let fireBtn = new Button('images/ui/BtnStartNormal.png', 'images/ui/BtnStartSelected.png', 128, 64, function(point) {
        //     // this.player.fire();
        //     Logger.print("TODO: fire!");
        // }.bind(this));
        // fireBtn.position = new Vector2(90, 100);
        // this.addChild(fireBtn);

        // buttons
        let jumpBtn = new Button('', '', gm.designWidth, gm.designHeight, function(point) {
            this.player.jump();
        }.bind(this));
        jumpBtn.position = new Vector2(gm.designWidth / 2, gm.designHeight / 2);
        this.addChild(jumpBtn);
    }

    update(dt) {
        if (this.lastLevel != gm.level) {
            this.lastLevel = gm.level;
            this.levelTxt.str = 'level: ' + gm.level.toString();
        }

        if (this.lastScore != gm.score) {
            this.lastScore = gm.score;
            this.scoreTxt.str = 'score: ' + gm.score.toString();
        }

        super.update(dt);
    }

    onSwitchIn() {
        // ActionManager.instance.addAction(new ActionCallFunc(function() {
        //     SceneManager.instance.switchToScene("MainScene");
        //     // SceneManager.instance.quitGame = true;
        // }, 5));
    }
}
