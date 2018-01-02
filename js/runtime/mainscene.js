import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'
import EventManager     from '../manager/event_manager'

import Logger           from '../base/logger'
import Vector2          from '../base/vector'
import Scene            from '../base/scene'
import Sprite           from '../base/sprite'
import Selectable       from '../base/selectable'
import Button           from '../base/button'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import PlayScene        from '../runtime/playscene'

export default class MainScene extends Scene {
    constructor() {
        super();

        // this.player = new Player();
        // this.player.addChild(new Sprite('images/hero.png', 80, 80, 0, 100));
        // this.addChild(this.player);

        let button = new Button(0, 0, 100, 100, function(point) {
            Logger.print("button onSelect: " + point.toString());
        });
        this.addChild(button);
    }

    onSwitchIn() {
        ActionManager.instance.addAction(new ActionCallFunc(function() {
            // SceneManager.instance.switchToScene(new PlayScene());
            EventManager.instance.dispatch("abc", 123);
        }, 3));

        EventManager.instance.addEventListener("abc", this.onSceneChanged);
    }

    onSwitchOut() {
        EventManager.instance.removeEventListener("abc", this.onSceneChanged);
    }

    onSceneChanged(data) {
        // Logger.print("event_manager: " + data);
    }
}
