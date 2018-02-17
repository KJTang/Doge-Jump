import GameManager      from '../manager/game_manager'
import EventManager     from '../manager/event_manager'
import PhysicsManager   from '../manager/physics_manager'
import SceneManager     from '../manager/scene_manager'
import ActionManager    from '../manager/action_manager'
import ActionCallFunc   from '../manager/action/action_callfunc'

import Vector2          from '../base/vector'
import Node             from '../base/node'
import Sprite           from '../base/sprite'
import Animation        from '../base/animation'
import Rect             from '../base/rect'
import Logger           from '../base/logger'

import String           from '../utility/utility_string'

const PLAYER_IMG_SRC = 'images/character/doge_{0}.jpg'
const PLAYER_WIDTH   = 64
const PLAYER_HEIGHT  = 48

const PLAYER_JUMP_TIME = 0.3; 
const PLAYER_JUMP_HEIGHT = 100;
// acceleration: a = 2h / t^2
const PLAYER_JUMP_ACCE = - 2 * PLAYER_JUMP_HEIGHT / Math.pow(PLAYER_JUMP_TIME, 2);
// init velocity: v = a * t
const PLAYER_JUMP_VEL = - PLAYER_JUMP_ACCE * PLAYER_JUMP_TIME;

export default class Player extends Node {
    constructor(x = 0, y = 0) {
        super(PLAYER_WIDTH, PLAYER_HEIGHT);

        this.originX = x;
        this.originY = y;
        this.position = new Vector2(this.originX, this.originY);

        this.lastClickTime = 0;
        this.isJumping = false;
        this.curJumpTime = 0;

        this.jumpFrameCounter = 0;
        this.jumpIsUp = true;

        this.dead = false;

        // animation
        let frames = [];
        for (let i = 0; i != 6; ++i) {
            frames.push(PLAYER_IMG_SRC.formatUnicorn(i.toString()));
        }
        this.anim = new Animation(frames[1], PLAYER_WIDTH, PLAYER_HEIGHT);
        this.anim.initFrames(frames);
        this.anim.play();
        this.addChild(this.anim);
    }

    onEnable() {
        super.onEnable();

        // dead callback
        this.deadListener = this.onPlayerDied.bind(this);
        EventManager.instance.addEventListener("YouDied", this.deadListener);

        // collision
        PhysicsManager.instance.addCollider("PLAYER", this);
        PhysicsManager.instance.addRule("PLAYER", "ROCK");
        // PhysicsManager.instance.addRule("PLAYER", "REDPOCKET");
    }

    onDisable() {
        super.onDisable();
        EventManager.instance.removeEventListener("YouDied", this.deadListener);
        PhysicsManager.instance.removeCollider("PLAYER", this);
        PhysicsManager.instance.removeRule("PLAYER", "ROCK");
        // PhysicsManager.instance.removeRule("PLAYER", "REDPOCKET");
    }

    update(dt) {
        if (!this.dead) {
            this.jumpUpdate(dt);
        }

        super.update(dt);
    }

    jump() {
        let curTime = new Date().getTime();
        if (curTime - this.lastClickTime < PLAYER_JUMP_TIME * 2 * 1000) {
            return;
        }
        this.lastClickTime = curTime;

        this.isJumping = true;
        this.curJumpTime = 0;

        // when jumping, pause animation
        this.anim.pause();
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

            // when jump finished, resume animation
            this.anim.resume();
            return;
        }

        let height = PLAYER_JUMP_VEL * this.curJumpTime + 0.5 * PLAYER_JUMP_ACCE * Math.pow(this.curJumpTime, 2);
        this.position = new Vector2(this.originX, this.originY + height);

        this.curJumpTime += dt;
    }

    getBoundingBox() {
        let rect = new Rect();
        rect.x = this.canvasRect.x + this.canvasRect.width / 4;
        rect.y = this.canvasRect.y + this.canvasRect.height / 4;
        rect.width = this.canvasRect.width / 2;
        rect.height = this.canvasRect.height / 2;
        return rect; 
    }

    onCollisionBegin(other, tag) {
        Logger.print("onCollisionBegin: ", tag, GameManager.instance.frameCnt);
        if (tag == 'ROCK') {
            EventManager.instance.dispatch("YouDied", null);
        } else if (tag == 'REDPOCKET') {
            Logger.print("afdsafdsafdsa");
        }
    }

    onPlayerDied() {
        this.dead = true;
        this.anim.pause();
    }
}
