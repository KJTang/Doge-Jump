import Node from 'node'
import Logger from 'logger'

/**
 * 游戏基础的精灵类
 */
export default class Sprite extends Node {
    constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
        super(x, y, width, height);

        this.img     = new Image();
        this.img.src = imgSrc;

        this.visible = true;
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        ctx.drawImage(
            this.img,
            0,
            0,
            this.width,
            this.height,
            this.worldPosition.x,
            window.innerHeight - this.worldPosition.y,
            this.width,
            this.height
        );
        
        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    // /**
    //  * 将精灵图绘制在canvas上
    //  */
    // drawToCanvas(ctx) {
    //     if ( !this.visible )
    //         return

    //     ctx.drawImage(
    //         this.img,
    //         this.x,
    //         this.y,
    //         this.width,
    //         this.height
    //     )
    // }

    /**
     * 简单的碰撞检测定义：
     * 另一个精灵的中心点处于本精灵所在的矩形内即可
     * @param{Sprite} sp: Sptite的实例
     */
    isCollideWith(sp) {
        let spX = sp.x + sp.width / 2
        let spY = sp.y + sp.height / 2

        if ( !this.visible || !sp.visible )
            return false

        return !!(   spX >= this.x
                            && spX <= this.x + this.width
                            && spY >= this.y
                            && spY <= this.y + this.height  )
    }
}
