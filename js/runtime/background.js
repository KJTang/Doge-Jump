import GameManager      from '../manager/game_manager'
import Node             from '../base/node'
import Sprite           from '../base/sprite'
import Vector2          from '../base/vector'

const BG_IMG_SRC    = 'images/background.png'
const BG_WIDTH      = GameManager.instance.designWidth;
const BG_HEIGHT     = GameManager.instance.designHeight;
const BG_MOVE_SPEED = 30;  // pixel per second

export default class BackGround extends Node {
    constructor() {
        super(BG_WIDTH, BG_HEIGHT);
        this.bg1 = new Sprite(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT);
        this.bg1.pivot = new Vector2(0, 0);
        this.bg1.position = new Vector2(0, 0);
        this.addChild(this.bg1);

        this.bg2 = new Sprite(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT);
        this.bg2.pivot = new Vector2(0, 0);
        this.bg2.position = new Vector2(BG_WIDTH, 0);
        this.addChild(this.bg2);
    }

    update(dt) {
        let offset = BG_MOVE_SPEED * dt;
        let x1 = this.bg1.position.x - offset;
        if (x1 <= -BG_WIDTH) {
            x1 = BG_WIDTH;
        }
        let x2 = this.bg2.position.x - offset;
        if (x2 <= -BG_WIDTH) {
            x2 = BG_WIDTH;
        }

        this.bg1.position = new Vector2(x1, 0);
        this.bg2.position = new Vector2(x2, 0);
    }
}
