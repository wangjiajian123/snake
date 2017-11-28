;(function(window){

    var util = {
        //在准备一个获取指定范围的随机数
        getRandom:function (n,m){
            //算法不带一点一点解释
            return Math.floor(Math.random() * (m - n) + n);
        }
    }

    //此时这个util口子开不开就没所谓
    window.util = util;

    //用局部变量保存一下全局变量，沙箱里面的东西都是局部变量
    //var util = window.util;  --  这个时候已经不用单独声明了
    var document = window.document;
    var map = document.querySelector(".map");

    function Food(x,y,width,height,color){
        this.x = x || 0;
        this.y = y || 0;
        //默认宽高必须是地图宽高的公因数
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
        //既然每次创建食物对象，必然有一个盒子要出现在页面上，干脆把这个过程也写到new的过程里面
        this.init(map);
    }

//生成一个对应的元素的方法
    Food.prototype.init = function(map){
        //生成随机位置
        // 1  随机位置要在地图的宽高之内
        // 2  随机位置要在方格之内 -- 随机数在0到多份之间，最后再*宽高
        var maxX = map.clientWidth / this.width;
        var maxY = map.clientHeight / this.height;
        this.x = util.getRandom(0,maxX) * this.width;
        this.y = util.getRandom(0,maxY) * this.height;

        //生成元素
        var ele = document.createElement("div");
        //设置样式
        ele.style.width = this.width + "px";
        ele.style.height = this.height  + "px";
        ele.style.backgroundColor = this.color;
        //设置定位和位置
        ele.style.position = "absolute";
        ele.style.left = this.x + "px";
        ele.style.top = this.y + "px";

        //追加到页面中
        map.appendChild(ele);
        //把元素和食物对象关联起来
        this.element = ele;
    }

    //自己移除自己的方法
    Food.prototype.remove = function(){
        //蛇的方块表现在页面中无非就是一个元素，如果要把元素移除，低啊用  removeChild()
        //  父节点.removeChild(子节点)
        //把对应的元素从map里移除
        this.element.parentNode.removeChild(this.element);
    }

    window.Food = Food;

    //var document = window.document;
    //var map = document.querySelector(".map");

    var Direction = Object.create(Object.prototype,{
        //像这种：不会改变、不希望被改变的东西：  常量  -- 命名规范： 全都使用大写
        TOP:{
            value:0
        },
        RIGHT:{
            value:1
        },
        BOTTOM:{
            value:2
        },
        LEFT:{
            value:3
        }
    });

    function Snake(width,height,direction){
        //这个宽高是每个格子的宽高，不是蛇本身的宽高
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || Direction.RIGHT;
        //还要有一个可以存储蛇的身体信息的数组
        this.body = [];
        //约定：使用索引为0的方块作为蛇头，剩下的作为蛇的身体
        this.body[0] = {
            x : 60,
            y : 20,
            color: "hotpink"
        };
        this.body[1] = {
            x : 40,
            y : 20,
            color: "skyblue"
        };
        this.body[2] = {
            x : 20,
            y : 20,
            color: "skyblue"
        };
        //需要一个可以存储body对应的div的数组
        this.elements = [];
        //调用初始化方法，创建对应的元素
        this.init(map);
    }
    //初始化
    Snake.prototype.init = function(map){
        //根据body数组，创建多个div
        for(var i = 0; i < this.body.length ; i++){
            var div = document.createElement("div");
            //设置div的样式
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.backgroundColor = this.body[i].color;
            //设置定位，设置位置
            div.style.position = "absolute";
            div.style.left = this.body[i].x + "px";
            div.style.top = this.body[i].y + "px";
            //追加到页面
            map.appendChild(div);
            //把这些元素和snake对象关联起来
            this.elements.push(div);
        }

    }
    //让蛇移动的方法
    Snake.prototype.move = function(){
        //后一格总是把前一格的上一次的位置拿过来
        //修改每一个格子的x和y，再修改到对应的元素身上
        for(var i = this.body.length - 1; i > 0 ; i--){
            //把前一个格子的信息设置到后一个格子上
            var current = this.body[i];
            var prev = this.body[i-1];
            current.x = prev.x;
            current.y = prev.y;
            //同步到元素身上
            this.elements[i].style.left = current.x + "px";
            this.elements[i].style.top = current.y + "px";
        }
        //还要移动蛇头 -- 根据蛇的当前方向来移动
        switch (this.direction){
            case Direction.TOP:
                this.body[0].y -= this.height;
                break;
            case Direction.RIGHT:
                this.body[0].x += this.width;
                break;
            case Direction.BOTTOM:
                this.body[0].y += this.height;
                break;
            case Direction.LEFT:
                this.body[0].x -= this.width;
                break;
        }
        //同步到蛇头对应的div身上
        this.elements[0].style.left = this.body[0].x + "px";
        this.elements[0].style.top = this.body[0].y + "px";
    }
    //蛇自己长多一格的方法
    Snake.prototype.growth = function(map){
        //新生产的尾部，跟原本的最后一个格子是一样
        var last = this.body[this.body.length-1];
        //准备一个描述新增的尾部的格子信息的对象
        var obj = {
            x: last.x,
            y: last.y,
            color: last.color
        };
        //信息同步，body用来装所有身体的信息的，自然也要把最后一个新的格子也加入进来
        this.body.push(obj);
        //创建一个div，追加到尾部
        var div = document.createElement("div");
        //设置样式 -- 样式从哪里来？把原来body的最后一个，复制一份过来
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = obj.color;
        //设置定位，设置位置
        div.style.position = "absolute";
        div.style.left = obj.x + "px";
        div.style.top = obj.y + "px";
        //追加到map
        map.appendChild(div);
        //把div存到elements数组
        this.elements.push(div);
    }

    //这个同意开放不开放取决于你自己
    window.Direction = Direction;
    window.Snake = Snake;

    //var Food = window.Food;
    //var Snake = window.Snake;
    //var document = window.document;
    //var Direction = window.Direction;
    //var map = document.querySelector(".map");

    function Game(){
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        //调用一下开始游戏的函数
        this.start();
        //调用一下绑定按键修改蛇的方向的方法
        this.bindKey();
    }
    //游戏开始的方法
    Game.prototype.start = function(){

        //让蛇移动
        //setInterval(this.snake.move.bind(this.snake),200);
        var _that = this;
        var timer = setInterval(function(){
            _that.snake.move();

            //判断蛇是否超出地图边界
            //最小值肯定是0，最大值 800*600 - 一个格子
            //判断谁的位置和最大值和最小值比较？ 蛇头
            var head = _that.snake.body[0];
            //判断蛇头的位置和地图边界的关系
            if(head.x < 0 || head.x > _that.map.offsetWidth - _that.food.width){
                //游戏结束
                //不能再动了 -- 清除定时器
                clearInterval(timer);
                //提示游戏结束
                alert("GAME OVER");
            }
            if(head.y < 0 || head.y > _that.map.offsetHeight - _that.snake.height){
                //游戏结束
                //不能再动了 -- 清除定时器
                clearInterval(timer);
                //提示游戏结束
                alert("GAME OVER");
            }
            /** 这块吃到蛇的身体的逻辑 ***/
            // 怎么样判断蛇碰到自己的身体？ 蛇的身体：  头  ——  蓝色的蛇身
            //  遍历  蓝色的蛇身 如果蛇身的某个方块和头的x，y完全重合， 吃到自己的身体
            for(var i = 1; i < _that.snake.body.length ; i++){
                var currentBody = _that.snake.body[i];
                //判断蛇的身体的xy和蛇头的xy是否完全重合
                if(currentBody.x === head.x && currentBody.y === head.y){
                    //不能再动了 -- 清除定时器
                    clearInterval(timer);
                    //提示游戏结束
                    alert("GAME OVER");
                }
            }
            /** 这块吃到蛇的身体的逻辑 ***/

            //蛇头碰到食物时的逻辑  --  食物的位置和蛇头的位置重合
            if(head.x === _that.food.x && head.y === _that.food.y){
                //蛇把食物吃掉 -- 把食物移除的时候，让食物自己移除自己，找到食物对象，指挥食物对象，自己灭亡
                _that.food.remove();
                //蛇的身体多一格
                //要让蛇多一格，这一格应该长在哪里？长在尾部
                _that.snake.growth(_that.map);
                //生成新的食物
                _that.food = new Food();
            }
        },200);
    }
    //控制蛇的方向
    Game.prototype.bindKey = function(){
        //绑定按键，控制蛇的方向
        //给document绑定一个按键事件，根据不同的按键修改蛇的方向
        document.addEventListener("keydown",function(e){
            //根据方向键，修改蛇的方向
            /**
             *    37  左边
             *    38  上
             *    39  右
             *    40  下
             */
            switch (e.keyCode){
                case 37:
                    //修改蛇的方向
                    this.snake.direction = Direction.LEFT;
                    break;
                case 38:
                    //修改蛇的方向
                    this.snake.direction = Direction.TOP;
                    break;
                case 39:
                    //修改蛇的方向
                    this.snake.direction = Direction.RIGHT;
                    break;
                case 40:
                    //修改蛇的方向
                    this.snake.direction = Direction.BOTTOM;
                    break;
            }
        }.bind(this),false);
    }


    window.Game = Game;

})(window);