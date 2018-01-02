import Vector2  from './vector'
import Rect     from './rect'
import Logger   from './logger'

export default class Node {
    _position = new Vector2(0, 0);
    _worldPosition = new Vector2(0, 0);
    _pivot = new Vector2(0, 0);
    _rect = new Rect(0, 0, 0, 0);

    isWorldPosDirty = true;
    isRectDirty = true;
    isLevelDirty = true;
    isIndexDirty = true;

    _enable = false;
    _visible = true;
    visibleBeforeDisable = true;

    parent = null;
    children = [];

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.position = new Vector2(x, y);
        this.width  = width;
        this.height = height;

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
            this.setTransformDirty();
        });
    }

    get position() {
        return new Vector2(this._position.x, this._position.y);
    }

    get worldPosition() {
        if (!this.isWorldPosDirty) {
            return this._worldPosition;
        }

        this._worldPosition = this.position;
        if (this.parent != null) {
            this._worldPosition.add(this.parent.worldPosition);
        }

        this.isWorldPosDirty = false;
        return this._worldPosition;
    }

    set pivot(value) {
        this._pivot = value;
    }

    get pivot() {
        return this._pivot;
    }

    get rect() {
        if (!this.isRectDirty) {
            return this._rect;
        }

        this._rect.x      = this.worldPosition.x;
        this._rect.y      = this.worldPosition.y;
        this._rect.width  = this.width;
        this._rect.height = this.height;
        this.isRectDirty = false;
        return this._rect;
    }

    addChild(node) {
        node.setParent(this);
        this.children.push(node);
    }

    removeChild(node) {
        for (var i = 0; i != this.children.length; ++i) {
            if (this.children[i] == node) {
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
            this.worldPosition.position = Vector2.sub(this.worldPosition, parent.worldPosition);
        }
    }

    // pos at entire scene
    static getLevel(node) {
        if (!this.isLevelDirty) {
            return this.level;
        }
        this.level = 0;
        let parent = node.parent;
        while (parent) {
            parent = parent.parent;
            this.level += 1;
        }
        this.isLevelDirty = false;
        return this.level;
    }

    // pos at cur parent
    static getIndex(node) {
        if (!this.isIndexDirty) {
            return this.index;
        }
        this.isIndexDirty = false;
        if (!node.parent) {
            return this.index = 0;
        }
        for (var i = 0; i != node.parent.children.length; ++i) {
            if (node.parent.children[i] == node) {
                return this.index = i;
            }
        }
    }

    static destory(node) {
        node.enable = false;
        node.children.forEach(function(child) {
            Node.destory(child);
        });
        if (node.parent) {
            node.parent.removeChild(node);
        }
    }
}
