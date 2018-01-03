import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'
import EventManager     from '../manager/event_manager'
import GameManager      from '../manager/game_manager'

import Logger           from '../base/logger'
import Vector2          from '../base/vector'
import Scene            from '../base/scene'
import Sprite           from '../base/sprite'
import Text             from '../base/text'
import Selectable       from '../base/selectable'
import Button           from '../base/button'

import Player           from '../runtime/player'
import Background       from '../runtime/background'
import PlayScene        from '../runtime/playscene'

export default class MainScene extends Scene {
    constructor() {
        super();
        let sprite = new Sprite('images/enemy.png', 30, 30);
        sprite.pivot = new Vector2(0.5, 0.5);
        sprite.position = new Vector2(GameManager.instance.designWidth / 2, GameManager.instance.designHeight / 2);
        this.addChild(sprite);

        // let button = new Button('images/enemy.png', 'images/hero.png', 100, 100, function(point) {
        //     Logger.print("button onSelect: " + point.toString());
        // });
        // this.addChild(button);

        // let button2 = new Button('images/enemy.png', 'images/hero.png', 100, 100, function(point) {
        //     Logger.print("button2 onSelect: " + point.toString());
        // });
        // button2.position = new Vector2(50, 0);
        // this.addChild(button2);

        let startBtn = new Button('images/ui/BtnStartNormal.png', 'images/ui/BtnStartSelected.png', 128, 64, function(point) {
            SceneManager.instance.switchToScene("PlayScene");
        });
        startBtn.position = new Vector2(100, 100);
        startBtn.position = new Vector2(GameManager.instance.designWidth / 2, GameManager.instance.designHeight / 2);
        this.addChild(startBtn);

        let text = new Text('images/enemy.png', 100, "#ff0000", "bottom");
        text.pivot = new Vector2(0, 0);
        text.position = new Vector2(GameManager.instance.designWidth / 2, GameManager.instance.designHeight / 2);
        this.addChild(text);
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
