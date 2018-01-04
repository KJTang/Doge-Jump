import GameManager      from '../manager/game_manager'
import Node             from './node'
import Vector2          from './vector'
import Logger           from './logger'

export default class Text extends Node {
    constructor(textStr = '', width = 0, style = "#ffffff", baseline = "middle", fontSize = 20, font = "Arial", stroke = false) {
        super(width, 0);

        this.str = textStr;
        this.style = style;
        this.fontSize = fontSize;
        this.font = font;
        this.baseline = baseline;
        this.stroke = stroke;
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        Text.renderText(ctx, this, this.str, this.style, this.baseline, this.fontSize, this.font, this.stroke);
        
        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    static renderText(ctx, node, str, style = "#ffffff", baseline = "middle", fontSize = 20, font = "Arial", stroke = false) {
        ctx.fillStyle = style;
        ctx.font = (fontSize * GameManager.instance.scaleRate).toString() + "px " + font;
        ctx.textBaseline = baseline;
        let canvasRect = node.canvasRect;
        if (!stroke) {
            ctx.fillText(
                str, 
                canvasRect.x, 
                canvasRect.y, 
                canvasRect.width
            );
        } else {
            ctx.strokeText(
                str, 
                canvasRect.x, 
                canvasRect.y, 
                canvasRect.width
            );
        }
    }
}
