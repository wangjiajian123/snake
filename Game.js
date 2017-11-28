;(function(window){

    var util = {
        //��׼��һ����ȡָ����Χ�������
        getRandom:function (n,m){
            //�㷨����һ��һ�����
            return Math.floor(Math.random() * (m - n) + n);
        }
    }

    //��ʱ���util���ӿ�������û��ν
    window.util = util;

    //�þֲ���������һ��ȫ�ֱ�����ɳ������Ķ������Ǿֲ�����
    //var util = window.util;  --  ���ʱ���Ѿ����õ���������
    var document = window.document;
    var map = document.querySelector(".map");

    function Food(x,y,width,height,color){
        this.x = x || 0;
        this.y = y || 0;
        //Ĭ�Ͽ�߱����ǵ�ͼ��ߵĹ�����
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
        //��Ȼÿ�δ���ʳ����󣬱�Ȼ��һ������Ҫ������ҳ���ϣ��ɴ���������Ҳд��new�Ĺ�������
        this.init(map);
    }

//����һ����Ӧ��Ԫ�صķ���
    Food.prototype.init = function(map){
        //�������λ��
        // 1  ���λ��Ҫ�ڵ�ͼ�Ŀ��֮��
        // 2  ���λ��Ҫ�ڷ���֮�� -- �������0�����֮�䣬�����*���
        var maxX = map.clientWidth / this.width;
        var maxY = map.clientHeight / this.height;
        this.x = util.getRandom(0,maxX) * this.width;
        this.y = util.getRandom(0,maxY) * this.height;

        //����Ԫ��
        var ele = document.createElement("div");
        //������ʽ
        ele.style.width = this.width + "px";
        ele.style.height = this.height  + "px";
        ele.style.backgroundColor = this.color;
        //���ö�λ��λ��
        ele.style.position = "absolute";
        ele.style.left = this.x + "px";
        ele.style.top = this.y + "px";

        //׷�ӵ�ҳ����
        map.appendChild(ele);
        //��Ԫ�غ�ʳ������������
        this.element = ele;
    }

    //�Լ��Ƴ��Լ��ķ���
    Food.prototype.remove = function(){
        //�ߵķ��������ҳ�����޷Ǿ���һ��Ԫ�أ����Ҫ��Ԫ���Ƴ����Ͱ���  removeChild()
        //  ���ڵ�.removeChild(�ӽڵ�)
        //�Ѷ�Ӧ��Ԫ�ش�map���Ƴ�
        this.element.parentNode.removeChild(this.element);
    }

    window.Food = Food;

    //var document = window.document;
    //var map = document.querySelector(".map");

    var Direction = Object.create(Object.prototype,{
        //�����֣�����ı䡢��ϣ�����ı�Ķ�����  ����  -- �����淶�� ȫ��ʹ�ô�д
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
        //��������ÿ�����ӵĿ�ߣ������߱���Ŀ��
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || Direction.RIGHT;
        //��Ҫ��һ�����Դ洢�ߵ�������Ϣ������
        this.body = [];
        //Լ����ʹ������Ϊ0�ķ�����Ϊ��ͷ��ʣ�µ���Ϊ�ߵ�����
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
        //��Ҫһ�����Դ洢body��Ӧ��div������
        this.elements = [];
        //���ó�ʼ��������������Ӧ��Ԫ��
        this.init(map);
    }
    //��ʼ��
    Snake.prototype.init = function(map){
        //����body���飬�������div
        for(var i = 0; i < this.body.length ; i++){
            var div = document.createElement("div");
            //����div����ʽ
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.backgroundColor = this.body[i].color;
            //���ö�λ������λ��
            div.style.position = "absolute";
            div.style.left = this.body[i].x + "px";
            div.style.top = this.body[i].y + "px";
            //׷�ӵ�ҳ��
            map.appendChild(div);
            //����ЩԪ�غ�snake�����������
            this.elements.push(div);
        }

    }
    //�����ƶ��ķ���
    Snake.prototype.move = function(){
        //��һ�����ǰ�ǰһ�����һ�ε�λ���ù���
        //�޸�ÿһ�����ӵ�x��y�����޸ĵ���Ӧ��Ԫ������
        for(var i = this.body.length - 1; i > 0 ; i--){
            //��ǰһ�����ӵ���Ϣ���õ���һ��������
            var current = this.body[i];
            var prev = this.body[i-1];
            current.x = prev.x;
            current.y = prev.y;
            //ͬ����Ԫ������
            this.elements[i].style.left = current.x + "px";
            this.elements[i].style.top = current.y + "px";
        }
        //��Ҫ�ƶ���ͷ -- �����ߵĵ�ǰ�������ƶ�
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
        //ͬ������ͷ��Ӧ��div����
        this.elements[0].style.left = this.body[0].x + "px";
        this.elements[0].style.top = this.body[0].y + "px";
    }
    //���Լ�����һ��ķ���
    Snake.prototype.growth = function(map){
        //��������β������ԭ�������һ��������һ��
        var last = this.body[this.body.length-1];
        //׼��һ������������β���ĸ�����Ϣ�Ķ���
        var obj = {
            x: last.x,
            y: last.y,
            color: last.color
        };
        //��Ϣͬ����body����װ�����������Ϣ�ģ���ȻҲҪ�����һ���µĸ���Ҳ�������
        this.body.push(obj);
        //����һ��div��׷�ӵ�β��
        var div = document.createElement("div");
        //������ʽ -- ��ʽ������������ԭ��body�����һ��������һ�ݹ���
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = obj.color;
        //���ö�λ������λ��
        div.style.position = "absolute";
        div.style.left = obj.x + "px";
        div.style.top = obj.y + "px";
        //׷�ӵ�map
        map.appendChild(div);
        //��div�浽elements����
        this.elements.push(div);
    }

    //���ͬ�⿪�Ų�����ȡ�������Լ�
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
        //����һ�¿�ʼ��Ϸ�ĺ���
        this.start();
        //����һ�°󶨰����޸��ߵķ���ķ���
        this.bindKey();
    }
    //��Ϸ��ʼ�ķ���
    Game.prototype.start = function(){

        //�����ƶ�
        //setInterval(this.snake.move.bind(this.snake),200);
        var _that = this;
        var timer = setInterval(function(){
            _that.snake.move();

            //�ж����Ƿ񳬳���ͼ�߽�
            //��Сֵ�϶���0�����ֵ 800*600 - һ������
            //�ж�˭��λ�ú����ֵ����Сֵ�Ƚϣ� ��ͷ
            var head = _that.snake.body[0];
            //�ж���ͷ��λ�ú͵�ͼ�߽�Ĺ�ϵ
            if(head.x < 0 || head.x > _that.map.offsetWidth - _that.food.width){
                //��Ϸ����
                //�����ٶ��� -- �����ʱ��
                clearInterval(timer);
                //��ʾ��Ϸ����
                alert("GAME OVER");
            }
            if(head.y < 0 || head.y > _that.map.offsetHeight - _that.snake.height){
                //��Ϸ����
                //�����ٶ��� -- �����ʱ��
                clearInterval(timer);
                //��ʾ��Ϸ����
                alert("GAME OVER");
            }
            /** ���Ե��ߵ�������߼� ***/
            // ��ô���ж��������Լ������壿 �ߵ����壺  ͷ  ����  ��ɫ������
            //  ����  ��ɫ������ ��������ĳ�������ͷ��x��y��ȫ�غϣ� �Ե��Լ�������
            for(var i = 1; i < _that.snake.body.length ; i++){
                var currentBody = _that.snake.body[i];
                //�ж��ߵ������xy����ͷ��xy�Ƿ���ȫ�غ�
                if(currentBody.x === head.x && currentBody.y === head.y){
                    //�����ٶ��� -- �����ʱ��
                    clearInterval(timer);
                    //��ʾ��Ϸ����
                    alert("GAME OVER");
                }
            }
            /** ���Ե��ߵ�������߼� ***/

            //��ͷ����ʳ��ʱ���߼�  --  ʳ���λ�ú���ͷ��λ���غ�
            if(head.x === _that.food.x && head.y === _that.food.y){
                //�߰�ʳ��Ե� -- ��ʳ���Ƴ���ʱ����ʳ���Լ��Ƴ��Լ����ҵ�ʳ�����ָ��ʳ������Լ�����
                _that.food.remove();
                //�ߵ������һ��
                //Ҫ���߶�һ����һ��Ӧ�ó����������β��
                _that.snake.growth(_that.map);
                //�����µ�ʳ��
                _that.food = new Food();
            }
        },200);
    }
    //�����ߵķ���
    Game.prototype.bindKey = function(){
        //�󶨰����������ߵķ���
        //��document��һ�������¼������ݲ�ͬ�İ����޸��ߵķ���
        document.addEventListener("keydown",function(e){
            //���ݷ�������޸��ߵķ���
            /**
             *    37  ���
             *    38  ��
             *    39  ��
             *    40  ��
             */
            switch (e.keyCode){
                case 37:
                    //�޸��ߵķ���
                    this.snake.direction = Direction.LEFT;
                    break;
                case 38:
                    //�޸��ߵķ���
                    this.snake.direction = Direction.TOP;
                    break;
                case 39:
                    //�޸��ߵķ���
                    this.snake.direction = Direction.RIGHT;
                    break;
                case 40:
                    //�޸��ߵķ���
                    this.snake.direction = Direction.BOTTOM;
                    break;
            }
        }.bind(this),false);
    }


    window.Game = Game;

})(window);