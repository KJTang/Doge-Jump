import GameManager      from '../manager/game_manager'
import EventManager     from '../manager/event_manager'
import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'

import Logger           from '../base/logger'
import Vector2          from '../base/vector'
import Sprite           from '../base/sprite'
import Scene            from '../base/scene'
import Text             from '../base/text'
import Button           from '../base/button'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import RockCreator      from '../runtime/rock_creator'
import RedPocketCreator from '../runtime/redpocket_creator'

let gm = GameManager.instance;

export default class PlayScene extends Scene {
    constructor() {
        // Logger.print('PlayScene: constructor');
        super();

        // this.bg = new Background();
        // this.addChild(this.bg);

        // text
        this.levelTxt = new Text('level: 0', 100, "#000000", "bottom");
        this.addChild(this.levelTxt);
        this.levelTxt.pivot = new Vector2(0, 0);
        this.levelTxt.position = new Vector2(25, gm.designHeight * 0.95);

        this.scoreTxt = new Text('score: 0', 100, "#000000", "bottom");
        this.addChild(this.scoreTxt);
        this.scoreTxt.pivot = new Vector2(0, 0);
        this.scoreTxt.position = new Vector2(25, gm.designHeight * 0.90);

        // environment
        this.rockCreator = new RockCreator();
        this.addChild(this.rockCreator);
        this.rockCreator.start();

        // this.redpocketCreator = new RedPocketCreator();
        // this.addChild(this.redpocketCreator);
        // this.redpocketCreator.start();

        // player
        this.player = new Player(gm.designWidth * 0.3, gm.designHeight * 0.4);
        this.addChild(this.player);

        // buttons
        this.jumpBtn = new Button('', '', gm.designWidth, gm.designHeight, function(point) {
            this.player.jump();
        }.bind(this));
        this.jumpBtn.position = new Vector2(gm.designWidth / 2, gm.designHeight / 2);
        this.addChild(this.jumpBtn);

        // dialog
        this.dialog = new Sprite('images/ui/BtnStartNormal.png', gm.designWidth * 0.8, gm.designHeight * 0.5);
        this.dialog.position = new Vector2(gm.designWidth / 2, gm.designHeight / 2);
        let dialogBtn = new Button('images/ui/BtnStartNormal.png', 'images/ui/BtnStartSelected.png', 128, 64, function(point) {
            // reload scene
            SceneManager.instance.switchToScene('PlayScene');
            // SceneManager.instance.quitGame = true;
        }.bind(this));
        dialogBtn.position = new Vector2(0, -64);
        this.dialog.addChild(dialogBtn);
        this.addChild(this.dialog);
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

    onEnable() {
        super.onEnable();
        // Logger.print("PlayScene: onEnable");
        
        this.deadListener = this.onPlayerDied.bind(this);
        EventManager.instance.addEventListener("YouDied", this.deadListener);
    }

    onDisable() {
        super.onDisable();
        // Logger.print("PlayScene: onDisable");

        EventManager.instance.removeEventListener("YouDied", this.deadListener);
    }

    onSwitchIn() {
        this.jumpBtn.enable = true;
        this.dialog.enable = false;
    }

    onPlayerDied() {
        this.jumpBtn.enable = false;
        this.dialog.enable = true;
    }
}
