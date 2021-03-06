import Manager      from './manager'
import EventManager from './event_manager'
import GameManager  from './game_manager'

import Logger       from '../base/logger'
import Node         from '../base/node'
import Vector2      from '../base/vector'
import Rect         from '../base/rect'

export default class InputManager extends Manager {
    selectables = [];
    curSelecting = [];

    constructor() {
        super();
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this));
    }

    static get instance() {
        if (this._instance == null) {
            this._instance = new InputManager();
        }
        return this._instance;
    }

    update(dt) {
        super.update(dt);

        if (this.needProcessDownEvt) {
            this.needProcessDownEvt = false;
            this.isTouching = true;
            this.handleSelectDown();
            // Logger.print("touch start: " + this.touchPos.toString());
            EventManager.instance.dispatch("TouchStart", this.touchPos);
        }
        if (this.needProcessUpEvt) {
            this.needProcessUpEvt = false;
            this.isTouching = false;
            this.handleSelectUp();
            // Logger.print("touch end: " + this.touchPos.toString());
            EventManager.instance.dispatch("TouchEnd", this.touchPos);
        }
    }

    onTouchStart(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
        this.touchPos = GameManager.instance.transPointCanvasToWorld(new Vector2(this.curTouchX, this.curTouchY));

        this.needProcessDownEvt = true;
    }

    onTouchMove(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
    }

    onTouchEnd(e) {
        e.preventDefault();
        this.touchPos = GameManager.instance.transPointCanvasToWorld(new Vector2(this.curTouchX, this.curTouchY));

        this.needProcessUpEvt = true;
    }

    onTouchCancel(e) {
        e.preventDefault();
        this.isTouching = false;
    }

    addSelectable(select) {
        this.selectables.push(select);

        // sort: put node has higher level/index to the front of array
        this.selectables.sort(function(a, b) {
            if (Node.getLevel(a) < Node.getLevel(b)) {
                return -1;
            } else if (Node.getLevel(a) > Node.getLevel(b)) {
                return 1;
            } else if (Node.getIndex(a) < Node.getIndex(b)) {
                return -1;
            } else if (Node.getIndex(a) > Node.getIndex(b)) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    removeSelectable(select) {
        for (var i = 0; i != this.selectables.length; ++i) {
            if (this.selectables[i] == select) {
                this.selectables.splice(i, 1);
                break;
            }
        }
    }

    handleSelectDown() {
        let point = GameManager.instance.transPointCanvasToWorld(new Vector2(this.curTouchX, this.curTouchY));
        this.curSelecting = [];

        // on select down
        for (let i = 0; i != this.selectables.length; ++i) {
            let select = this.selectables[i];
            // Logger.print("handleSelectDown: " + select.rect.toString());
            // Logger.print("handleSelectDown: " + point.toString());
            if (Rect.isOverlapPoint(select.rect, point)) {
                this.curSelecting.push(select);
                select.onSelectDown(point);

                // stop event passing
                if (select.swallowTouch) {
                    break;
                }
            }
        }
    }

    handleSelectUp() {
        let point = GameManager.instance.transPointCanvasToWorld(new Vector2(this.curTouchX, this.curTouchY));

        // on select up
        for (let i = 0; i != this.curSelecting.length; ++i) {
            let select = this.curSelecting[i];
            select.onSelectUp(point);
            // on select
            if (Rect.isOverlapPoint(select.rect, point)) {
                this.curSelecting[i].onSelect(point);
            }
        }
    }
}