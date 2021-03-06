/**
 * Created by Chernov Sergey on 04.12.2016.
 *
 */
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function() {
    "use strict";
    /**
     * Vector
     */
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    Vector.prototype = {
        set: function (x, y) {
            if (typeof x === 'object') {
                y = x.y;
                x = x.x;
            }
            this.x = x || 0;
            this.y = y || 0;
            return this;
        }
    };
    /*
     * Node
     */
    function Node(x, y, radius) {
        this.target = new Vector(x, y);
        this.curXY = randXY();
        this.p = new Vector(this.curXY.x, this.curXY.y)
        this.radius = radius;
        this.active = true;
        this.color = colors[randomInt(0, colors.length - 1)];
        //this.color = "#000";
    }

    Node.prototype.update = function (delta) {
        var speed = distance(this.p.x, this.p.y, this.target.x, this.target.y) / 10;
        //if(speed < 1) {
        //    speed = randomInt(1,2) > 1 ? -0.5: 0.5;
        //}
        if(move(this.p, this.target, speed)) {
            this.p.set(this.target.x, this.target.y);
        }
    };

    Node.prototype.draw = function (c) {
        //c.fillStyle = this.color;
        ////c.fillStyle = this.color;
        //c.beginPath();
        //c.arc(this.p.x, this.p.y, this.radius, 0, Math.PI * 2, true);
        //c.fill();
        //c.closePath();
        //var g = ctx.createRadialGradient(this.p.x, this.p.y, this.radius, this.p.x, this.p.y, this.radius / 2);
        // getRandomFrad(g, this.color);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    };
    //utils
    function randomInt( min, max ) {
        return Math.round(min + ( Math.random() * ( max - min ) ));
    }
    function distance(ax, ay, bx, by) {
        return Math.sqrt(Math.pow( ax - bx, 2) + Math.pow( ay - by, 2));
    }
    function distanceX(ax, bx) {
        return Math.abs(ax - bx);
    }
    function randXY() {
        //switch(randomInt( 1, 4 )) {
        //    case 1: return {x: randomInt(-10, width + 10), y: -10}; // Top
        //    case 2: return {x: width + 10, y: randomInt(-10, height + 10)}; // Right
        //    case 3: return {x: randomInt(-10, width + 10), y: height + 10}; // Bottom
        //    case 4: return {x: -10, y: randomInt(-10, height + 10)}; // Left
        //}
        return {x: randomInt(-10, width + 10), y: randomInt(-10, height + 10) }
    }

    function getRandomFrad(g, r) {
        g.addColorStop(0,'rgba(50,25,64,1)');
        g.addColorStop(.5, 'rgba(50,25,64,0.3)');
        g.addColorStop(1,'rgba(50,25,64,1)');

    }
    /*
     * Движения объекта из одной точки в другую в 2D пространстве.
     * Функция принимает указатель на объект, тем самым меняя его координаты.
     *
     * @param {x,y} begin - координаты оъекта
     * @param {x,y} end - цель оъекта
     * @param {number} speed - скорость движения
     * @return {bool} достиг ли объект цели
     */
    function move(begin, end, speed) {
        var angle = Math.atan2(end.y - begin.y, end.x - begin.x);

        begin.x += speed * Math.cos(angle);
        begin.y += speed * Math.sin(angle);

        return distance(begin.x, begin.y, end.x, end.y) < speed;
    };
    /////////////////////////////////////////////////////
    // Initialize
    /////////////////////////////////////////////////////

    // Configs

    var BG_COLOR      = 'rgba(255, 250, 250, 0)',
        RELATION_COLOR      = 'rgba(89,80,255, 1)',
        PARTICLE_RADIUS       = 5,
        CHART_LENGTH = 5;

    var charts = {
        //   0 1 2 3 4 5 -> CHART_LENGTH
        // 0
        // 1 X X X X X
        // 2 X       X
        // 3 X       X => П => [6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33]
        // 4 X       X
        // 5 X       X

        "А": [7, 8, 9, 16, 19, 20, 21, 22, 24, 28, 31, 32, 33, 34],
        "Б": [6, 7, 8, 9, 12, 18, 19, 20, 21, 24, 28, 30, 31, 32, 33],
        "В": [6, 7, 8, 9, 12, 16, 18, 19, 20, 21, 24, 28, 30, 31, 32, 33],
        "Г": [6, 7, 8, 9, 12, 18, 24, 30],
        "Д": [8, 9, 13, 15, 19, 21, 25, 27, 30, 31, 32, 33, 34],
        "Е": [6, 7, 8, 9, 10, 12, 18, 19, 20, 21, 24, 30, 31, 32, 33, 34],
        "Ж": [6, 8, 10, 12, 14, 16, 19, 20, 21, 24, 26, 28, 30, 32, 34],
        "З": [6, 7, 8, 9, 16, 19, 20, 21, 28, 30, 31, 32, 33],
        "И": [6, 10, 12, 15, 16, 18, 20, 22, 24, 25, 28, 30, 34],
        "Й": [2, 6, 10, 12, 15, 16, 18, 20, 22, 24, 25, 28, 30, 34],
        "К": [6, 10, 12, 15, 18, 19, 20, 24, 27, 30, 34],
        "Л": [8, 9, 10, 13, 16, 18, 22, 24, 28, 30, 34],
        "М": [6, 10, 12, 13, 15, 16, 18, 20, 22, 24, 26, 28, 30, 34],
        "Н": [6, 9, 12, 15, 18, 19, 20, 21, 24, 27, 30, 33],
        "О": [7, 8, 9, 12, 16, 18, 22, 24, 28, 31, 32, 33],
        "П": [6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33],
        "Р": [6, 7, 8, 9, 12, 16, 18, 19, 20, 21, 24, 30],
        "С": [7, 8, 9, 12, 18, 24, 31, 32, 33],
        "Т": [6, 7, 8, 9, 10, 14, 20, 26, 32],
        "У": [6, 9, 12, 15, 19, 20, 21, 27, 30, 31, 32],
        "Ф": [7, 8, 9, 12, 14, 16, 18, 20, 22, 25, 26, 27, 32],
        "Х": [	6, 10, 13, 15, 20, 25, 27, 30, 34],
        "Ц": [0, 3, 6, 9, 12, 15, 18, 21, 24, 25, 26, 27, 28, 34],
        "Ч": [6, 9, 12, 15, 19, 20, 21, 27, 33],
        "Ш": [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31, 32, 33, 34],
        "Щ": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 25, 26, 27, 28, 29, 35],
        "Ъ": [6, 7, 13, 19, 20, 21, 22, 25, 29, 31, 32, 33, 34],
        "Ы": [6, 11, 12, 17, 18, 19, 20, 23, 24, 27, 29, 30, 31, 32, 35],
        "Ь": [6, 12, 18, 19, 20, 21, 24, 28, 30, 31, 32, 33],
        "Э": [6, 7, 8, 15, 18, 19, 20, 21, 27, 30, 31, 32],
        "Ю": [6, 9, 10, 12, 14, 17, 18, 19, 20, 23, 24, 26, 29, 30, 33, 34],
        "Я": [7, 8, 9, 10, 12, 16, 19, 20, 21, 22, 24, 28, 30, 34],
        " ": [],
        "!": [[3,1, 3,5], [4,1, 4,5], [3,7, 4,7]],
        "?": [1, 2, 6, 9, 14, 19, 31],
        "*": []
    };

    // Vars

    var setting = {
        canvas: 'js-canvas',
        parentSelector: 'js-intro'
    };

    var canvas, ctx,
        width, height,
        fontSize, //Размер шрифта в пискселях
        lineWidth,  //Ширина линии шривта в пикселях
        minDist, //Минимальное расстояние между узлами в пикселях
        cellWidth,//Ширина ячейки в пикселях. Высчитывается: Размер шрифта / CHART_LENGTH
        delta, last, fps,
        objects = [],
        text = [
            {word: "ПРИВЕТ", time: 2500, effect: 1},
            {word: "МЕНЯ ЗОВУТ*ЧЕРНОВ СЕРГЕЙ", time: 2500, effect: 1 },
            {word: "Я ФРОНТЕНД*РАЗРАБОТЧИК", time: 2500, effect: 2 },
            {word: "ЕСТЬ*ИНТЕРЕСНЫЙ*ПРОЕКТ?", time: 3500, effect: 1 },
            {word: "А ЕСЛИ НАЙДУ?", time: 3500, effect: 2 }
        ],
        mouse = new Vector(),
        isDown = false,
        currentText = 0, currentNode = 0, timer,
        //colors = ["#351330", "#424254", "#64908A", "#567779", "#3B2A41"];
        //colors = ["#351330", "#424254", "#64908A", "#C7AE8C", "#CC2A41"];
        colors = ["#351330", "#424254", "#64908A", "#CC2A41"];

    // Event Listeners

    function resize(e) {
        width  = canvas.width  = document.getElementsByClassName('container')[0].offsetWidth - 50;
        height  = canvas.height  = document.getElementById(setting.parentSelector).offsetHeight;
    }

    function mouseMove(e) {
        var rect = canvas.getBoundingClientRect();
        mouse.set(e.clientX - rect.left, e.clientY - rect.top);
    }

    function mouseDown(e) {
        isDown = true;
    }

    function mouseUp(e) {
        isDown = false;
    }

    // Functions

    /*
     * Рисуем линии между объектами, если они достаточно близко
     * TODO: Чтобы не пробегаться по всем объектам ещё раз, решил сюда добавить событие мыши при наведение на объекты
     */
    function drawRelation() {
        var i, k, node1, node2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = RELATION_COLOR;
        for(i = 0; i < currentNode; i++) {
            node1 = objects[i];
            if(!isDown && node1.active) {
                var dist = distance(mouse.x, mouse.y, node1.p.x, node1.p.y);
                if(dist < minDist * 2) {
                    node1.radius = Math.min((minDist * 2 * PARTICLE_RADIUS / dist), minDist);
                } else {
                    node1.radius = PARTICLE_RADIUS;
                }
            } else {
                if(node1.radius > PARTICLE_RADIUS) {
                    node1.p.x = mouse.x;
                    node1.p.y = mouse.y;
                    node1.anim1 = true;
                }
            }
            for(k = i + 1; k < currentNode; k++) {
                node2 = objects[k];
                joinNodes(node1.p, node2.p)
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    /*
     * рисуем линию между объектами.
     */
    function joinNodes(a, b) {
        var dist = distance(a.x, a.y, b.x, b.y);
        if (dist < minDist * 2) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }
    }

    /*
     * Отступ сверху и справа в пикселях
     *
     * @param {number} length длина слова
     * @param {number} number номер символа в слове
     * @param {number} rows количество строк
     * @param {number} row номер строки
     * @return {x, y} структура
     */
    function getOffset(length, number, rows, row) {
        //Высчитываем общую длину слова, учитывая промежутки между символами
        var commonWidth = cellWidth * CHART_LENGTH * length + (length - 1) * cellWidth,
            //Высчитываем общую высоты слов, учитывая промежутки между строками
            commonHeight = cellWidth * CHART_LENGTH * rows + (rows - 1) * cellWidth;

        //Высчитываем отступ от начала холста до первого символа.
        var offsetFirstW = (width - commonWidth) / 2;
        var offsetFirstH = (height - commonHeight) / 2;
        return {
            x: offsetFirstW + number * CHART_LENGTH * cellWidth + number * cellWidth,
            y: offsetFirstH + row * CHART_LENGTH * cellWidth + row * cellWidth * 2
            //y: height / row - fontSize / row
        }
    }

    function addObj(n) {
        var r;
        for(var i = 0; i < n; i++) {
            r = randXY();
            objects.push(new Node(r.x, r.y, PARTICLE_RADIUS));
        }

    }

    /*
     * Добавление случайных точек близ заданной прямой учитывая угол
     *
     * @param {array} m[0 - x1, 1 - y1, 3 - x2, 4 - y2] - координаты начала и конца прямой
     * @param {number} offsetX - отступ с лева
     * @param {number} offsetY - отступ с сверху
     */
    function addPointInChart(m, offsetX, offsetY) {
        var i;
        for(i = 0; i < m.length; i++) {

            objects[currentNode].target.x =  (m[i] % 6) * cellWidth + offsetX;
            objects[currentNode].target.y = ~~(m[i] / 6) * cellWidth + offsetY;
            currentNode ++;
        }
    }

    /*
     * Генерируем следующее слова из массита text
     * TODO: Тут надо немножко пофиксить, так как размер шрифта не всегда норм получается
     */
    function nextText() {
        var k, j;
        var txt = text[currentText]; //Строк в тексте

        var rows = txt.word.split('*'); //Символ * обозначает переход на новую строку. Делим строку на массив

        var max = 0; //Высчитываем максимальную длину строки в массиве rows.
        for(j = 0; j < rows.length; j++) {
            if(max < rows[j].length)
                max = rows[j].length;
        }

        fontSize = width / (max + 3);

        lineWidth = fontSize / 6;
        minDist = lineWidth;
        cellWidth = fontSize / CHART_LENGTH;
        PARTICLE_RADIUS = cellWidth / 2.1;
        currentNode = 0;

        for(j = 0; j < rows.length; j++) {
            for(k = 0; k < rows[j].length; k++) {
                var chart = charts[rows[j][k]];
                var offset = getOffset(rows[j].length, k, rows.length, j);
                addPointInChart(chart, offset.x, offset.y);
            }
        }

        timer = Date.now() + txt.time;
        currentText ++;
    }

    function removeChar() {
        for(var i = 0; i < currentNode; i++) {
            objects[i].target.set(randomInt(0, width), randomInt(0, height));
        }
    }

    // Start Update test
    var loop = function() {
        var i,
            now = Date.now();
        delta = (now - last) / 1000.0;
        last = now;
        fps = 1/delta;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);

        drawRelation();

        if(timer + 500 < now) {
            if(text[currentText - 1].effect == 2)
                removeChar();
        }
        if(timer + 1000 < now) {
            currentText = currentText % text.length;
            nextText();

        }

        for (i = 0; i < currentNode; i++) {
            objects[i].update(delta);
            objects[i].draw(ctx);
        }
        requestAnimationFrame(loop);
    };

    // Init
    function init() {

        canvas  = document.getElementById(setting.canvas);
        ctx = canvas.getContext('2d');
        resize();

        canvas.addEventListener('mousemove', mouseMove, false);
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        window.addEventListener('resize', resize, true);

        addObj(1000);

        nextText();

        loop();
    }

    init();
})();
