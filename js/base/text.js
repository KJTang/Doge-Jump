import Node             from './node'
import Vector2          from './vector'
import Logger           from './logger'

export default class Text extends Node {
    constructor(textStr = '', width = 0, style = "#ffffff", baseline = "middle", font = "20px Arial") {
        super(width, 0);
        // this.pivot = new Vector2(0, 0);

        this.str = textStr;
        this.style = style;
        this.font = font;
        this.baseline = baseline;
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        Text.renderText(ctx, this, this.str, this.style, this.baseline, this.font);
        
        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    static renderText(ctx, node, str, style = "#ffffff", baseline = "middle", font = "20px Arial") {
        ctx.fillStyle = style;
        ctx.font = font;
        ctx.textBaseline = baseline;
        let canvasPos = node.canvasPosition;
        ctx.fillText(
            str, 
            canvasPos.x, 
            canvasPos.y, 
            node.rect.width
        );
        // ctx.strokeText(
        //     str, 
        //     canvasPos.x, 
        //     canvasPos.y, 
        //     node.rect.width
        // );
    }
}
