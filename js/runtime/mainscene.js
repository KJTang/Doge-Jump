import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'
import Logger           from '../base/logger'
import Scene            from '../base/scene'
import Sprite           from '../base/sprite'
import Vector2          from '../base/vector'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import PlayScene        from '../runtime/playscene'

export default class MainScene extends Scene {
    constructor() {
        super();

        // this.bg = new Background();
        // this.addChild(this.bg);

        this.player = new Player();
        this.player.addChild(new Sprite('images/hero.png', 80, 80, 0, 100));
        this.addChild(this.player);

        ActionManager.instance.addAction(new ActionCallFunc(function() {
            SceneManager.instance.switchToScene(new PlayScene());
        }, 3));
    }
}
