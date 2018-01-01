import Vector2 from 'vector'
import Logger from 'logger'

export default class Node {
    _position = new Vector2(0, 0);
    _worldPosition = new Vector2(0, 0);
    isWorldPosDirty = true;

    _enable = false;
    _visible = true;

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

    set enable(value) {
        if (this._enable != value) {
            this._enable = value;
            if (value) {
                this.onEnable();
            } else {
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
        this.isWorldPosDirty = true;
        this.children.forEach(function(child) {
            child.isWorldPosDirty = true;
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

    addChild(node) {
        node.setParent(this);
        this.children.push(node);
    }

    removeChild(node) {
        for (var i = 0; i != this.children.length; ++i) {
            if (this.children[i] == node) {
                this.children.splice(i, 1);
                break;
            }
        }
    }

    setParent(parent, changeWorldPos = true) {
        this.parent = parent;

        if (changeWorldPos) {
            this.isWorldPosDirty = true;
        } else {
            this.worldPosition.position = Vector2.sub(this.worldPosition, parent.worldPosition);
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
