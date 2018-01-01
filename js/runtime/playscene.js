import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'
import Logger           from '../base/logger'
import Scene            from '../base/scene'

import Player           from '../runtime/player'
import Background       from '../runtime/background'

export default class PlayScene extends Scene {
    constructor() {
        super();

        this.bg = new Background();
        this.addChild(this.bg);

        this.player = new Player();
        this.addChild(this.player);

        ActionManager.instance.addAction(new ActionCallFunc(function() {
            SceneManager.instance.quitGame = true;
        }, 3));
    }
}
