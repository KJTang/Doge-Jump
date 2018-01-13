import GameManager      from '../manager/game_manager'
import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'

import Logger           from '../base/logger'
import Vector2          from '../base/vector'
import Scene            from '../base/scene'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import RockCreator      from '../runtime/rock_creator'

export default class PlayScene extends Scene {
    constructor() {
        super();

        // this.bg = new Background();
        // this.addChild(this.bg);

        this.rockCreator = new RockCreator();
        this.addChild(this.rockCreator);
        this.rockCreator.start();

        this.player = new Player(GameManager.instance.designWidth * 0.3, GameManager.instance.designHeight * 0.4);
        this.addChild(this.player);
    }

    onSwitchIn() {
        // ActionManager.instance.addAction(new ActionCallFunc(function() {
        //     SceneManager.instance.switchToScene("MainScene");
        //     // SceneManager.instance.quitGame = true;
        // }, 5));
    }
}
