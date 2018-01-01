import Enemy        from './npc/enemy'
import Player       from './runtime/player'
import BackGround   from './runtime/background'
import GameInfo     from './runtime/gameinfo'
import Music        from './runtime/music'
import DataBus      from './databus'

import SceneManager from './manager/scene_manager'
import ActionManager    from './manager/action_manager'

import Logger       from './base/logger'
import Node         from './base/node'
import Sprite       from './base/sprite'
import Vector2      from './base/vector'

import MainScene    from './runtime/mainscene'
import PlayScene    from './runtime/playscene'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
    managers = [];

    constructor() {
        this.restart()
    }

    restart() {

        // canvas.removeEventListener(
        //     'touchstart',
        //     this.touchHandler
        // )

        // this.bg       = new BackGround(ctx);
        // this.gameinfo = new GameInfo()
        // this.music    = new Music()

        this.managers.push(SceneManager.instance);
        this.managers.push(ActionManager.instance);

        this.managers.forEach(function(mgr) {
            mgr.restart();
        });

        // game entry
        SceneManager.instance.switchToScene(new MainScene());

        // game loop
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }

    // // 全局碰撞检测
    // collisionDetection() {
    //     // let that = this

    //     // databus.bullets.forEach((bullet) => {
    //     //     for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
    //     //         let enemy = databus.enemys[i]

    //     //         if ( !enemy.isPlaying && enemy.isCollideWith(bullet) ) {
    //     //             enemy.playAnimation()
    //     //             that.music.playExplosion()

    //     //             bullet.visible = false
    //     //             databus.score  += 1

    //     //             break
    //     //         }
    //     //     }
    //     // })

    //     // for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
    //     //     let enemy = databus.enemys[i]

    //     //     if ( this.player.isCollideWith(enemy) ) {
    //     //         databus.gameOver = true

    //     //         break
    //     //     }
    //     // }
    // }

    //游戏结束后的触摸事件处理逻辑
    touchEventHandler(e) {
        //  e.preventDefault()

        // let x = e.touches[0].clientX
        // let y = e.touches[0].clientY

        // let area = this.gameinfo.btnArea

        // if (   x >= area.startX
        //         && x <= area.endX
        //         && y >= area.startY
        //         && y <= area.endY  )
        //     this.restart()
        // }

        // /**
        //  * canvas重绘函数
        //  * 每一帧重新绘制所有的需要展示的元素
        //  */
        // render() {
        // ctx.clearRect(0, 0, canvas.width, canvas.height)

        // this.bg.render(ctx)

        // databus.bullets
        //              .concat(databus.enemys)
        //              .forEach((item) => {
        //                     item.drawToCanvas(ctx)
        //                 })

        // this.player.drawToCanvas(ctx)

        // databus.animations.forEach((ani) => {
        //     if ( ani.isPlaying ) {
        //         ani.aniRender(ctx)
        //     }
        // })

        // this.gameinfo.renderGameScore(ctx, databus.score)
    }

    // 游戏逻辑更新主函数
    update(dt) {
        // this.collisionDetection()

        SceneManager.instance.update(dt);
        ActionManager.instance.update(dt);
    }

    lateUpdate() {
        SceneManager.instance.lateUpdate();
    }

    render() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        SceneManager.instance.render(ctx);
    }

    // 实现游戏帧循环
    loop() {
        if (!this.lastTime) {
            this.lastTime = new Date().getTime();
        }
        this.curTime = new Date().getTime();

        this.update((this.curTime - this.lastTime) / 1000);
        this.lateUpdate();
        this.render();

        this.lastTime = this.curTime;

        // databus.frame++
        // this.update();
        // this.render();
        // if ( databus.frame % 20 === 0 ) {
        //     this.player.shoot()
        //     this.music.playShoot()
        // }

        // // 游戏结束停止帧循环
        // if ( databus.gameOver ) {
        //     this.gameinfo.renderGameOver(ctx, databus.score)

        //     this.touchHandler = this.touchEventHandler.bind(this)
        //     canvas.addEventListener('touchstart', this.touchHandler)

        //     return
        // }

        if (SceneManager.instance.quitGame) {
            return;
        }
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }
}
