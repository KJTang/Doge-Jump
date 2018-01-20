// import Bullet   from '../player/bullet'
// import DataBus  from '../databus'

import GameManager      from '../manager/game_manager'
import EventManager     from '../manager/event_manager'
import PhysicsManager   from '../manager/physics_manager'
import Vector2  from '../base/vector'
import Sprite   from '../base/sprite'
import Logger   from '../base/logger'

const PLAYER_IMG_SRC = 'images/character/dino.png'
const PLAYER_WIDTH   = 48
const PLAYER_HEIGHT  = 64

const PLAYER_JUMP_TIME = 0.3; 
const PLAYER_JUMP_HEIGHT = 100;
// acceleration: a = 2h / t^2
const PLAYER_JUMP_ACCE = - 2 * PLAYER_JUMP_HEIGHT / Math.pow(PLAYER_JUMP_TIME, 2);
// init velocity: v = a * t
const PLAYER_JUMP_VEL = - PLAYER_JUMP_ACCE * PLAYER_JUMP_TIME;

export default class Player extends Sprite {
    constructor(x = 0, y = 0) {
        super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

        this.originX = x;
        this.originY = y;
        this.position = new Vector2(this.originX, this.originY);

        this.lastClickTime = 0;
        this.isJumping = false;
        this.curJumpTime = 0;

        this.jumpFrameCounter = 0;
        this.jumpIsUp = true;
    }

    onEnable() {
        super.onEnable();
        // EventManager.instance.addEventListener("TouchStart", this.onTouchStart.bind(this));
        PhysicsManager.instance.addCollider("PLAYER", this);
        PhysicsManager.instance.addRule("PLAYER", "ROCK");
    }

    onDisable() {
        super.onDisable();
        // EventManager.instance.removeEventListener("TouchStart", this.onTouchStart.bind(this));
        PhysicsManager.instance.removeCollider("PLAYER", this);
        PhysicsManager.instance.removeRule("PLAYER", "ROCK");
    }

    update(dt) {
        this.jumpUpdate(dt);
    }

    // onTouchStart(point) {
    //     this.jump();
    // }

    jump() {
        let curTime = new Date().getTime();
        if (curTime - this.lastClickTime < PLAYER_JUMP_TIME * 2 * 1000) {
            return;
        }
        this.lastClickTime = curTime;

        this.isJumping = true;
        this.curJumpTime = 0;
    }

    jumpUpdate(dt) {
        // start jump
        if (!this.isJumping) {
            return;
        }
        // stop jump
        if (this.curJumpTime >= PLAYER_JUMP_TIME * 2) {
            this.isJumping = false;
            this.position = new Vector2(this.originX, this.originY);
            return;
        }

        let height = PLAYER_JUMP_VEL * this.curJumpTime + 0.5 * PLAYER_JUMP_ACCE * Math.pow(this.curJumpTime, 2);
        this.position = new Vector2(this.originX, this.originY + height);

        this.curJumpTime += dt;
    }

    onCollisionBegin(other) {
        Logger.print("Player: onCollisionBegin");
    }
}
