// import Bullet   from './bullet'
// import DataBus  from '../databus'

import Vector2  from '../base/vector'
import Sprite   from '../base/sprite'
import Logger   from '../base/logger'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = 80
const PLAYER_HEIGHT  = 80

const PLAYER_JUMP_HEIGHT = 100;
const PLAYER_JUMP_TIME = 60;    // 60 frame per jump
const PLAYER_JUMP_ACCE = 60;    // acceleration

// let databus = new DataBus()

export default class Player extends Sprite {
    constructor() {
        super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

        // 玩家默认处于屏幕底部居中位置
        this.originX = screenWidth / 2 - this.width / 2;
        this.originY = this.height + 30;
        this.x = this.originX;
        this.y = this.originY;

        this.position = new Vector2(0, 100);

        // // 用于在手指移动的时候标识手指是否已经在飞机上了
        // this.touched = false
        // this.bullets = []

        // // 初始化事件监听
        // this.initEvent()

        this.jumpFrameCounter = 0;
        this.jumpIsUp = true;
    }

    update(dt) {
        this.jump();
    }

    jump() {
        let height = 0;
        if (this.jumpIsUp) {
            height = (1 - Math.pow(1 - this.jumpFrameCounter / PLAYER_JUMP_TIME, 2)) * PLAYER_JUMP_HEIGHT;
        } else {
            height = (1 - Math.pow(this.jumpFrameCounter / PLAYER_JUMP_TIME, 2)) * PLAYER_JUMP_HEIGHT;
        }
        this.position = new Vector2(this.x, this.originY + height);

        ++this.jumpFrameCounter;
        if (this.jumpFrameCounter == PLAYER_JUMP_TIME) {
            this.jumpFrameCounter = 0;
            this.jumpIsUp = !this.jumpIsUp;
        }
    }

    /**
     * 当手指触摸屏幕的时候
     * 判断手指是否在飞机上
     * @param {Number} x: 手指的X轴坐标
     * @param {Number} y: 手指的Y轴坐标
     * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
     */
    checkIsFingerOnAir(x, y) {
        const deviation = 30

        return !!(   x >= this.x - deviation
                            && y >= this.y - deviation
                            && x <= this.x + this.width + deviation
                            && y <= this.y + this.height + deviation  )
    }

    /**
     * 根据手指的位置设置飞机的位置
     * 保证手指处于飞机中间
     * 同时限定飞机的活动范围限制在屏幕中
     */
    setAirPosAcrossFingerPosZ(x, y) {
        let disX = x - this.width / 2
        let disY = y - this.height / 2

        if ( disX < 0 )
            disX = 0

        else if ( disX > screenWidth - this.width )
            disX = screenWidth - this.width

        if ( disY <= 0 )
            disY = 0

        else if ( disY > screenHeight - this.height )
            disY = screenHeight - this.height

        this.x = disX
        this.y = disY
    }

    /**
     * 玩家响应手指的触摸事件
     * 改变战机的位置
     */
    initEvent() {
        canvas.addEventListener('touchstart', ((e) => {
            e.preventDefault()

            let x = e.touches[0].clientX
            let y = e.touches[0].clientY

            //
            if ( this.checkIsFingerOnAir(x, y) ) {
                this.touched = true

                this.setAirPosAcrossFingerPosZ(x, y)
            }

        }).bind(this))

        canvas.addEventListener('touchmove', ((e) => {
            e.preventDefault()

            let x = e.touches[0].clientX
            let y = e.touches[0].clientY

            if ( this.touched )
                this.setAirPosAcrossFingerPosZ(x, y)

        }).bind(this))

        canvas.addEventListener('touchend', ((e) => {
            e.preventDefault()

            this.touched = false
        }).bind(this))
    }

    // /**
    //  * 玩家射击操作
    //  * 射击时机由外部决定
    //  */
    // shoot() {
    //     let bullet = databus.pool.getItemByClass('bullet', Bullet)

    //     bullet.init(
    //         this.x + this.width / 2 - bullet.width / 2,
    //         this.y - 10,
    //         10
    //     )

    //     // databus.bullets.push(bullet)
    // }
}
