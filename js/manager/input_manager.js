import Manager      from './manager'
import EventManager from './event_manager'

import Logger       from '../base/logger'
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

    onTouchStart(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
        let pos = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        this.isTouching = true;

        this.handleSelectDown();
        // Logger.print("touch start: " + pos.toString());
        EventManager.instance.dispatch("TouchStart", pos);
    }

    onTouchMove(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
    }

    onTouchEnd(e) {
        e.preventDefault();
        let pos = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        this.isTouching = false;

        this.handleSelectUp();
        // Logger.print("touch end: " + pos.toString());
        EventManager.instance.dispatch("TouchEnd", pos);
    }

    onTouchCancel(e) {
        e.preventDefault();
        this.isTouching = false;
    }

    addSelectable(select) {
        this.selectables.push(select);
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
        let point = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        this.curSelecting = [];
        this.selectables.forEach(function(select) {
            // Logger.print("handleSelectDown: " + select.rect);
            if (Rect.isOverlapPoint(select.rect, point)) {
                InputManager.instance.curSelecting.push(select);
                select.onSelectDown(point);
            }
        });
    }

    handleSelectUp() {
        // let point = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        // this.curSelecting.forEach(function(select) {
        //     // Logger.print("handleSelectUp: " + select.rect);
        //     select.onSelectUp(point);
        //     if (Rect.isOverlapPoint(select.rect, point)) {
        //         select.onSelect(point);
        //     }
        // });

        let point = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        // on select up
        for (let i = 0; i != this.curSelecting.length; ++i) {
            let select = this.curSelecting[i];
            select.onSelectUp(point);
            if (!Rect.isOverlapPoint(select.rect, point)) {
                this.curSelecting[i] = this.curSelecting[this.curSelecting.length - 1];
                this.curSelecting.pop();
                --i;
            }
        }

        // sort
        this.curSelecting.sort(function(a, b) {
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

        // on select
        for (let i = 0; i != this.curSelecting.length; ++i) {
            // if swallow event 
            if (this.curSelecting[i].onSelect(point)) {
                break;
            }
        }
    }
}