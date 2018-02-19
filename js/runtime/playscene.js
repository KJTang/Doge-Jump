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

        // text
        this.scoreTxt = new Text('MONEY: 0', 100, "#000000", "bottom");
        this.addChild(this.scoreTxt);
        this.scoreTxt.pivot = new Vector2(0, 0);
        this.scoreTxt.position = new Vector2(25, gm.designHeight * 0.95);

        // environment
        // this.bg = new Background();
        // this.addChild(this.bg);

        this.rockCreator = new RockCreator();
        this.addChild(this.rockCreator);
        this.rockCreator.start();

        this.redpocketCreator = new RedPocketCreator();
        this.addChild(this.redpocketCreator);
        this.redpocketCreator.start();

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
        this.dialog = new Sprite('images/ui/BtnNormal.png', gm.designWidth * 0.8, gm.designHeight * 0.5);
        this.addChild(this.dialog);
        this.dialog.position = new Vector2(gm.designWidth / 2, gm.designHeight / 2);
        
        let dialogBtn = new Button('images/ui/BtnNormal.png', 'images/ui/BtnSelected.png', 128, 64, function(point) {
            // reload scene
            SceneManager.instance.switchToScene('PlayScene');
            // SceneManager.instance.quitGame = true;
        }.bind(this));
        this.dialog.addChild(dialogBtn);
        dialogBtn.position = new Vector2(0, -64);

        let dialogBtnName = new Text('RESTART', 100, "#000000", "middle");
        dialogBtn.addChild(dialogBtnName);
        dialogBtnName.position = new Vector2(0, 0);

        let dialogTitle = new Text('YOU\'VE GOT:', 120, "#000000", "bottom");
        this.dialog.addChild(dialogTitle);
        dialogTitle.position = new Vector2(0, 90);
    }

    update(dt) {
        super.update(dt);
    }

    onEnable() {
        super.onEnable();
        // Logger.print("PlayScene: onEnable");
        
        this.deadListener = this.onPlayerDied.bind(this);
        this.scoreListener = this.onGetPocket.bind(this);

        EventManager.instance.addEventListener("YouDied", this.deadListener);
        EventManager.instance.addEventListener("RedPocket", this.scoreListener);
    }

    onDisable() {
        super.onDisable();
        // Logger.print("PlayScene: onDisable");

        EventManager.instance.removeEventListener("YouDied", this.deadListener);
        EventManager.instance.removeEventListener("RedPocket", this.scoreListener);
    }

    onSwitchIn() {
        this.jumpBtn.enable = true;
        this.dialog.enable = false;
    }

    onPlayerDied() {
        this.jumpBtn.enable = false;
        this.dialog.enable = true;

        let dialogContent = new Text(gm.score.toString(), gm.score.toString().length * 20, "#000000", "alphabetic", 40);
        this.dialog.addChild(dialogContent);
        dialogContent.pivot = new Vector2(0.5, 0.5);
        dialogContent.position = new Vector2(0, 40);
    }

    onGetPocket(data) {
        this.scoreTxt.str = 'MONEY: ' + gm.score.toString();
    }
}
