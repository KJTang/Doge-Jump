import GameManager      from '../manager/game_manager'
import Vector2  from './vector'
import Rect     from './rect'
import Logger   from './logger'

export default class Node {
    _position = new Vector2(0, 0);
    _worldPosition = new Vector2(0, 0);
    _pivot = new Vector2(0.5, 0.5);
    // rect: x y: save pivot position, w h: size
    _rect = new Rect(0, 0, 0, 0);
    _canvasRect = new Rect(0, 0, 0, 0);

    isWorldPosDirty = true;
    isRectDirty = true;
    isLevelDirty = true;
    isIndexDirty = true;

    _enable = false;
    _visible = true;
    visibleBeforeDisable = true;

    parent = null;
    children = [];

    constructor(width = 0, height = 0, x = 0, y = 0) {
        this.position = new Vector2(x, y);
        this._rect.width  = width;
        this._rect.height = height;

        this.enable = true;
    }

    update(dt) {
        if (!this.enable) {
            return;
        }

        this.children.forEach(function(child) {
            child.update(dt);
        });
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    onEnable() {
        // Logger.print("onEnable");
    }
    
    onDisable() {
        // Logger.print("onDisable");
    }

    setTransformDirty() {
        this.isWorldPosDirty = true;
        this.isRectDirty = true;
        this.isCanvasRectDirty = true;
        this.isLevelDirty = true;
        this.isIndexDirty = true;
    }

    set enable(value) {
        if (this._enable != value) {
            this._enable = value;
            if (value) {
                // visible if it's already visible before disable
                this.visible = this.visibleBeforeDisable;

                this.onEnable();
            } else {
                // invisible when disabled
                this.visibleBeforeDisable = this.visible;
                this.visible = false;

                this.onDisable();
            }
        }
    }

    get enable() {
        return this._enable;
    }

    set visible(value) {
        this._visible = value;
    }

    get visible() {
        return this._visible;
    }

    set position(value) {
        this._position.x = value.x;
        this._position.y = value.y;

        // set dirty
        this.setTransformDirty();
        this.children.forEach(function(child) {
            child.setTransformDirty();
        });
    }

    get position() {
        return new Vector2(this._position.x, this._position.y);
    }

    get worldPosition() {
        if (!this.isWorldPosDirty) {
            return this._worldPosition;
        }

        this._worldPosition.x = this.position.x;
        this._worldPosition.y = this.position.y;
        if (this.parent != null) {
            this._worldPosition.add(this.parent.worldPosition);
        }

        this.isWorldPosDirty = false;
        return this._worldPosition;
    }

    set pivot(value) {
        this._pivot = value;
        if (this._pivot.x > 1) {
            this._pivot.x = 1;
        }
        if (this._pivot.x < 0) {
            this._pivot.x = 0;
        }
        if (this._pivot.y > 1) {
            this._pivot.y = 1;
        }
        if (this._pivot.y < 0) {
            this._pivot.y = 0;
        }
        this.setTransformDirty();
    }

    get pivot() {
        return this._pivot;
    }

    get rect() {
        if (!this.isRectDirty) {
            return this._rect;
        }

        this._rect.x = this.worldPosition.x - this.pivot.x * this._rect.width;
        this._rect.y = this.worldPosition.y - this.pivot.y * this._rect.height;
        this.isRectDirty = false;
        return this._rect;
    }

    get canvasRect() {
        if (!this.isCanvasRectDirty) {
            return this._canvasRect;
        }

        this._canvasRect = new Rect(
            this.rect.x * GameManager.instance.scaleRate + GameManager.instance.scaleOffset.x,
            GameManager.instance.screenHeight - (this.rect.y + this.rect.height) * GameManager.instance.scaleRate + GameManager.instance.scaleOffset.y, 
            this.rect.width * GameManager.instance.scaleRate, 
            this.rect.height * GameManager.instance.scaleRate,
        );
        this.isCanvasRectDirty = false;
        return this._canvasRect;
    }

    getBoundingBox() {
        return this.canvasRect; 
    }

    onCollisionBegin(other) {
        // Logger.print("onCollisionBegin");
    }

    onCollision(other) {
        // Logger.print("onCollision");
    }

    onCollisionEnd(other) {
        // Logger.print("onCollisionEnd");
    }

    addChild(node) {
        node.setParent(this);
        this.children.push(node);
    }

    removeChild(node) {
        for (var i = 0; i != this.children.length; ++i) {
            if (this.children[i] == node) {
                node.parent = null;
                this.children.splice(i--, 1);
                break;
            }
        }
    }

    setParent(parent, changeWorldPos = true) {
        this.parent = parent;

        if (changeWorldPos) {
            this.setTransformDirty();
        } else {
            this.position = Vector2.sub(this.worldPosition, parent.worldPosition);
        }
    }

    // order at entire scene
    static getLevel(node) {
        if (!node.isLevelDirty) {
            return node.level;
        }
        node.level = 0;
        let parent = node.parent;
        while (parent) {
            parent = parent.parent;
            node.level += 1;
        }
        node.isLevelDirty = false;
        return node.level;
    }

    // order at cur parent
    static getIndex(node) {
        if (!node.isIndexDirty) {
            return node.index;
        }
        node.isIndexDirty = false;
        if (!node.parent) {
            return node.index = 0;
        }
        for (var i = 0; i != node.parent.children.length; ++i) {
            if (node.parent.children[i] == node) {
                return node.index = i;
            }
        }
    }

    static destory(node, removeFromParent = true) {
        node.enable = false;
        node.children.forEach(function(child) {
            // cause parent has removed, no need to removeFromParent
            Node.destory(child, false);
        });
        if (node.parent && removeFromParent) {
            node.parent.removeChild(node);
        }
    }
}
