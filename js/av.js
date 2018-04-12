var canvas;
var ctx;
var left;
var right;
var ball;

var spriteCoords = {
    'left1':  [  0, 402, 60, 52],
    'left2':  [ 60, 402, 60, 52],
    'left3':  [120, 402, 60, 52],
    'ball1':  [180, 402, 50, 42],
    'ball2':  [230, 402, 50, 42],
    'ball3':  [280, 402, 50, 42],
    'ball4':  [330, 402, 50, 42],
    'right1': [380, 402, 60, 52],
    'right2': [440, 402, 60, 52],
    'right3': [500, 402, 60, 52],
    '0':      [560, 402, 16, 16],
    '1':      [576, 402, 16, 16],
    '2':      [592, 402, 16, 16],
    '3':      [608, 402, 16, 16],
    '4':      [624, 402, 16, 16],
    '5':      [560, 418, 16, 16],
    '6':      [576, 418, 16, 16],
    '7':      [592, 418, 16, 16],
    '8':      [608, 418, 16, 16],
    '9':      [524, 418, 16, 16],
    'star':   [560, 434, 16, 16]
}

var soundNames = ['hit', 'point', 'loss'];
var sounds = {};
var soundEnabled = false;
var ldCount = 0;

var intervalId;

var speed = 50;

var rMode = false;
var rCnt;
var winner;
var tVelX;
var tVelY;

var x = [0, 0];
var y = [0, 0];
var px = [0, 0];
var frame = [0, 0];
var frameindex = [0, 0];
var rebound = [0, 0];
var score = [0, 0];
var bx, by;
var pbx, pby;
var tbx, tby;
var bVelX, bVelY;
var bLogic, bFrame;
var bIndex;
var serve;
var server;
var serveVel;
var compServe = 0;
var hits;
var hitter;
var starter;
var gravity;
var sStage;
var byTop;
var rnd;
var endGame;
var menuon;
var jflag;
var polecol = [0, 1, 2, 3, 3, 4, 6, 7, 9, 14];
var jump = [-4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4];
var keyMove = [{}, {}];
var opts = ['C', 'C'];

var olx;
var oly;
var orx;
var ory;
var obx;
var oby;

var oCoords = false;

var mode;

$(document).ready(function () {
    canvas = $("#viewport");
    ctx = canvas[0].getContext("2d");
    $(document).keydown(onKey);
    $(document).keyup(clearKeys);
    $('#play').click(function () {
        opts[0] = 'H';
        $('#play').hide();
        $('#lose').hide();
        $('#win').hide();
        $('#pause').hide();
        if (mode != 'pause')
            initGame();
        if (mode != 'menu') {
            mode = 'play';
            startLoop();
        } else {
            mode = 'play';
        }
    });
    mode = 'menu';
    sprites = new Image();
    sprites.src = 'img/sprites.png';
    sprites.onload = onLoad;
});

function loadSounds() {
    if ($.isEmptyObject(sounds)) {
        for (i = 0; i < soundNames.length; i++) {
            s = soundNames[i];
            sounds[s] = new Audio();
            sounds[s].src = 'sounds/' + s + '.wav';
        }
    }
}

function onLoad() {
    initGame();
    startLoop();
}

function clearKeys(e) {
    switch (e.keyCode) {
        case 37: {
            keyMove[0].left = 0;
            break;
        }
        case 39: {
            keyMove[0].right = 0;
            break;
        }
        case 38: {
            keyMove[0].up = 0;
            break;
        }
        case 65: {
            keyMove[1].left = 0;
            break;
        }
        case 68: {
            keyMove[1].right = 0;
            break;
        }
        case 87: {
            keyMove[1].up = 0;
            break;
        }
    }
}

function onKey(e) {
    switch (e.keyCode) {
        case 37: {
            keyMove[0].left = -2;
            break;
        }
        case 39: {
            keyMove[0].right = 2;
            break;
        }
        case 38: {
            keyMove[0].up = 1;
            break;
        }
        case 65: {
            keyMove[1].left = -2;
            break;
        }
        case 68: {
            keyMove[1].right = 2;
            break;
        }
        case 87: {
            keyMove[1].up = 1;
            break;
        }
        case 80: {
            keyMove[0].right = 0;
            keyMove[0].left = 0;
            keyMove[0].up = 0;
            if (mode != 'play') {
                $('#play').trigger('click');
            } else {
                stopLoop();
                mode = 'pause';
                $('#pause').show();
                $('#play').show();
            }
            break;
        }
        case 82: {
            if (mode == 'play') {
                initGame();
            }
            break;
        }
        case 83: {
            if (!soundEnabled) {
                loadSounds();
            }
            soundEnabled = !soundEnabled;
            break;
        }
        case 72: {
            $('#help').toggle();
            break;
        }
    }
}

function getPosition() {
    var i, tx, velx, bnd;
    for (i = 0; i < 2; i++) {
        if (keyMove[i].up && frameindex[i] == -1) {
            frameindex[i] = 0;
        }
        tx = x[i] + (velx = keyMove[i].left + keyMove[i].right);
        bnd = 3 + i * 155;
        if (velx > 0) {
            if (tx < bnd + 119) {
                x[i] = tx;
            } else {
                x[i] = bnd + 119;
            }
        } else {
            if (tx>bnd) {
                x[i] = tx;
            } else {
                x[i] = bnd;
            }
            if (frameindex[i] == -2) {
                y[i] = 173;
                frame[i] = 0;
                frameindex[i] = -1;
            }
            if (frameindex[i] == -1) {
                if (velx!=0) {
                    if (Math.abs(px[i] - x[i]) > 4) {
                        frame[i] ^= 1;
                        px[i] = x[i];
                    }
                } else {
                    frame[i] = 0;
                }
            } else {
                frame[i] = 2 + (frameindex[i] > 18);
                if (frameindex[i] == 19) {
                    y[i] -= 4;
                }
                y[i] += jump[frameindex[i]++];
                if (frameindex[i] > 37) {
                    frameindex[i] = -2;
                }
            }
        }
    }
}

function setWinner() {
    if (hits > 2) {
        winner = 1 - hitter;
    } else {
        winner = tbx < 150 ? 1 : 0;
    }
    tVelY = Math.abs(bVelY) >> 3;
    tVelX = Math.abs(bVelX) >> 3;
}

function resetPt() {
    keyMove[0].up = 0;
    keyMove[1].up = 0;
    getPosition();
    if (Math.abs(bVelX) > tVelX) {
        if (bVelX < 0) {
            bVelX = -tVelX;
        } else {
            bVelX = tVelX;
        }
    }
    if (Math.abs(bVelY) > tVelY) {
        if (bVelY < 0) {
            bVelY = -tVelY;
        } else {
            bVelY = tVelY;
        }
    }
    doCollisions();
    moveBall();
    putShapes();
}

function calculateScore() {
    if (winner == server) {
        if (soundEnabled && mode != 'menu') {
            sounds.point.play()
        }
        score[winner]++;
        if (score[winner] > 14 && score[winner] - score[1 - winner] > 1) {
            if (mode == 'play') {
                if (winner == 0) {
                    mode = 'win';
                    $('#win').show();
                } else {
                    mode = 'lose';
                    $('#lose').show();
                }
                $('#play').show();
                stopLoop();
            } else {
                initGame();
            }
        }
    } else {
        if (soundEnabled && mode != 'menu') {
            sounds.loss.play();
        }
        server=winner;
        putScore();
    }
    putScore();
    bx = (tbx = pbx = (64 + winner * 165)) << 6;
    by = (tby = pby = 135) << 6;
    bFrame = bLogic = bVelX = bVelY = hits = rebound[0] = rebound[1] = 0;
    bIndex = 6;
    serve = serveVel=1;
    hitter = 2;
    compServe = Math.abs(rnd) % 5;
    if (score[server] == 14) {
        compServe = 5;
    }
    sStage = 0;
}

function destination(pl, destX, tol) {
    var xp;
    xp = x[pl];
    if (Math.abs(xp - destX) < tol) {
        keyMove[pl].left = 0;
        keyMove[pl].right = 0;
        return 1;
    }
    if (xp < destX) {
        keyMove[pl].left = 0;
        keyMove[pl].right = 2;
    } else {
        keyMove[pl].left = -2;
        keyMove[pl].right = 0;
    }
    return 0;
}

function moveBall() {
    var rbVelX;
    var rbVelY;
    var hitFloor;
    rbVelX = bVelX;
    rbVelY = bVelY;
    if (rbVelX > 319) {
        rbVelX = 319;
    }
    if (rbVelX < -319) {
        rbVelX = -319;
    }
    if (rbVelY > 319) {
        rbVelY = 319;
    }
    if (rbVelY < -319) {
        rbVelY = -319;
    }
    pbx = tbx;
    pby = tby;
    bx += rbVelX;
    by += rbVelY;
    if (bx<320) {
        bx = 320;
        rbVelX =- rbVelX;
        rbVelX -= rbVelX >> 4;
        rbVelY -= rbVelY >> 4;
        if (hitter == 1) {
            hitter = 2;
            hits = 0;
        }
    }
    if (bx > 18112) {
        bx = 18112;
        rbVelX =- rbVelX;
        rbVelX -= rbVelX >> 4;
        rbVelY -= rbVelY >> 4;
        if (hitter == 0) {
            hitter = 2;
            hits = 0;
        }
    }
    if (by < 832) {
        by = 832;
        rbVelY = -rbVelY;
        rbVelX -= rbVelX >> 4;
        rbVelY -= rbVelY >> 4;
    }
    if (by > 11392) {
        by = 11392;
        rbVelY = -rbVelY;
        hitFloor = 0;
    } else {
        hitFloor = 1;
    }
    if (rbVelY>0) {
        rbVelY += 1;
    } else {
        rbVelY += 1;
    }
    tbx = bx >> 6;
    tby = by >> 6;
    bVelX = rbVelX;
    bVelY = rbVelY;
    return hitFloor;
}

function doCollisions() {
    var i, dx, dy, dist, rndOff, avy, jif, per;

    for (i = 0; i < 2; i++) {
        dx = tbx - x[i] - i * 7;
        dy = tby - y[i] >> 1;
        dist = (dx >> 2) * dx + dy * dy;
        if (dist < 110) {
            rndOff = 8 - (rnd & 15);
            if (frameindex[i] > -1) {
                bVelY = -Math.abs(bVelY) + (jump[frameindex[i]] << (3 << serveVel));
            } else {
                bVelY = -Math.abs(bVelY);
            }
            bVelY += rndOff;
            bVelX += dx * Math.abs(dx) + (keyMove[i].right + keyMove[i].left << (4 + serveVel)) + rndOff;
            if (!rebound[i]) {
                if (!menuon) {
                    avy = Math.abs(320 - Math.abs(bVelY));
                    per = 300 + avy;
                    jif = per >> 5;
                    if (soundEnabled && mode != 'menu') {
                        sounds.hit.play()
                    }
                }
                byTop = 200;
                serve = 0;
                rebound[i] = 1;
                if (hitter != i) {
                    hitter = i;
                    hits = 0;
                } else {
                    hits++;
                }
            }
        } else {
            if (rebound[i]) {
                rebound[i] = 0;
                serveVel = 0;
            }
        }
    }
    i = 1;
    if (tby > 91) {
        if (pbx < 128 && tbx > 127) {
            bVelX = -Math.abs(bVelX) >> 1;
            bx = 127 * 64;
            i = 0;
        } else {
            if (pbx > 159 && tbx < 160) {
                bVelX = Math.abs(bVelX) >> 1;
                bx = 160 * 64;
                i = 0;
            }
        }
    }
    if (i && tby > 81 && tbx > 127 && tbx < 160) {
        if (tby > 91) {
            if (tbx < 148) {
                bVelX = -Math.abs(bVelX);
            } else {
                bVelX = Math.abs(bVelX);
            }
        } else {
            if ((tbx > 147 && 161 - tbx >= polecol[91 - tby]) || (tbx < 148 && tbx - 133 >= polecol[91-tby])) {
                if (bVelY > 0) {
                    dx = tbx - 145;
                    if (dx < -5) {
                        bVelX = -Math.abs(bVelX);
                    }
                    if (dx > 5) {
                        bVelX = Math.abs(bVelX);
                    }
                    bVelY = -Math.abs(bVelY);
                }
                if (Math.abs(bVelX) > 32) {
                    bVelX = bVelX >> 1;
                }
                if (Math.abs(bVelY) > 32) {
                    bVelY = bVelY >> 1;
                }
            }
        }
    }
}

function computer0() {
    var yStep, destX, dx, rndOff, dest;
    keyMove[0].up = 0;
    if (tby < byTop) {
        byTop = tby;
    }
    rndOff = 5 - rnd % 10;
    if (serve && ((server & 1) == 0)) {
        switch (compServe) {
            case 0: {
                dest = destination(0, 55, 2);
                break;
            }
            case 1: {
                dest = destination(0, 84, 2);
                break;
            }
            case 2: {
                dest = destination(0, 80, 2);
                break;
            }
            case 3: {
                if (sStage == 0) {
                    if (dest = destination(0,44,2)) {
                        sStage = 1;
                    }
                }
                else {
                    destination(0,58,2);
                    dest = 1;
                }
                break;
            }
            case 4 : {
                if (sStage == 0) {
                    if (dest = destination(0, 90, 2)) {
                        sStage = 1;
                    }
                } else {
                    destination(0, 58, 2);
                    dest = 1;
                }
                break;
            }
            case 5 : {
                if (sStage == 0) {
                    if (destination(0, 3, 2)) {
                        sStage = 1;
                    }
                    dest = 0;
                } else {
                    destination(0, 8 + sStage++, 1);
                    dest = 1;
                }
                break;
            }
        }
        keyMove[0].up = dest;
    } else {
        if (bVelY > 0 && tbx < 140) {
            if (bVelY >> 6 == 0) {
                yStep = 0;
            } else {
                yStep = (140 - tby) / (bVelY >> 6);
                if (yStep < 1 || (bVelX >> 6) == 0) {
                    destX = tbx;
                } else {
                    destX = tbx + (bVelX >> 6) * yStep - 4;
                }
                dx = x[0] - tbx;
                if (Math.abs(bVelX) < 128 && byTop < 75) {
                    if ((tby < 158) ^ (bVelX < 0)) {
                        destination(0, tbx - 15, 3);
                    } else {
                        destination(0, tbx + 15, 3);
                    }
                } else {
                    if (tby > 130) {
                        if (Math.abs(dx) > 6 && Math.abs(bVelX) < 1024) {
                            destination(0, tbx - (x[0] - 60 >> 3), 3);
                        } else {
                            destination(0, tbx + rndOff + (x[0] - 60 >> 3), 10);
                            keyMove[0].up = x[0] < 105 && (hitter != 0 || hits < 2);
                        }
                    } else {
                        if (destX < 3) {
                            destX = 6 - destX;
                        }
                        if (destX>123) {
                            destX = 246 - destX;
                        }
                        destination(0, destX + rndOff, 3);
                    }
                }
            }
        } else {
            destination(0, 56, 8);
        }
    }
}

function computer1() {
    var yStep, destX, dx, rndOff, dest;
    keyMove[1].up = 0;
    if (tby < byTop) {
        byTop = tby;
    }
    rndOff = 5 - rnd % 10;
    if (serve && ((server & 1) == 1)) {
        switch (compServe) {
            case 0: {
                dest = destination(1, 232, 2);
                break;
            }
            case 1: {
                dest = destination(1, 202, 2);
                break;
            }
            case 2: {
                dest = destination(1, 208, 2);
                break;
            }
            case 3: {
                if (sStage == 0) {
                    if (dest = destination(1, 250, 2)) {
                        sStage = 1;
                    }
                } else {
                    destination(1, 220, 2);
                    dest = 1;
                }
                break;
            }
            case 4 : {
                if (sStage == 0) {
                    if (dest = destination(1, 190, 2)) {
                        sStage = 1;
                    }
                } else {
                    destination(1, 230, 2);
                    dest = 1;
                }
                break;
            }
            case 5 : {
                if (sStage == 0) {
                    if (destination(1, 277, 2)) {
                        sStage = 1;
                    }
                    dest = 0;
                } else {
                    destination(1, 272 - sStage++, 1);
                    dest = 1;
                }
                break;
            }
        }
        keyMove[1].up = dest;
    } else {
        if (bVelY > 0 && tbx > 125) {
            if (bVelY >> 6 == 0) {
                yStep = 0;
            } else {
                yStep = (140 - tby) / (bVelY >> 6);
            }
            if (yStep < 1 || (bVelX >> 6) == 0) {
                destX = tbx;
            } else {
                destX = tbx + (bVelX >> 6) * yStep - 4;
            }
            dx = x[1] - tbx;
            if (Math.abs(bVelX) < 128 && byTop < 75) {
                if ((tby < 158) ^ (bVelX < 0)) {
                    destination(1, tbx + 15, 3);
                } else {
                    destination(1, tbx - 15, 3);
                }
            } else {
                if (tby > 130) {
                    if (Math.abs(dx) > 6 && Math.abs(bVelX) < 1024) {
                        destination(1, tbx + (x[1] - 218 >> 3), 3);
                    } else {
                        destination(1, tbx - rndOff - (x[1] - 218 >> 3), 10);
                        keyMove[1].up = x[1] > 175 && (hitter != 1 || hits < 2);
                    }
                } else {
                    if (destX < 158) {
                        destX = 316 - destX;
                    }
                    if (destX > 277) {
                        destX = 554 - destX;
                    }
                    destination(1, destX - rndOff, 3);
                }
            }
        } else {
            destination(1, 211, 8);
        }
    }
}

function initGame() {
    var i;
    rnd = 0;
    starter = 0;
    hits = 0;
    bFrame = 0;
    bLogic = 0;
    bVelX = 0;
    bVelY = 0;
    tby = 0;
    bIndex = 6;
    byTop = 200;
    x[0] = 64;
    x[1] = 226;
    tbx = 400;
    for (i = 0; i < 2; i++) {
        px[i] = x[i];
        y[i] = 173;
        frameindex[i] = -1;
        rebound[i] = 0;
        score[i] = 0;
        keyMove[i].right = 0;
        keyMove[i].left = 0;
        keyMove[i].up = 0;
        frame[i] = 0;
    }
    putShapes();

    tbx = 64 + starter * 165;
    pbx = tbx;
    bx = tbx << 6;
    tby = 135
    pby = 135
    by = tby << 6;

    server = 2 + starter;
    hitter = 2;
    serve = 1;
    serveVel = 1;

    rMode = false;

    putScore();
}

function startLoop() {
    intervalId = setInterval(game, 1000 / speed);
}

function stopLoop() {
    clearInterval(intervalId);
}

function putScore() {
    var y = 8;

    var vs = "" + score[0];
    var startX = 64;
    if (vs.length < 2) {
        vs = "0" + vs;
    }
    startX = 64;
    ctx.clearRect(startX, y, 16 * 3, 16);
    draw(vs[0], startX, y);
    startX += 16;
    draw(vs[1], startX, y);
    startX += 16;
    if (server == 0) {
        draw('star', startX, y);
    }

    vs = "" + score[1];
    if (vs.length < 2) {
        vs = "0" + vs;
    }
    startX = 528;
    ctx.clearRect(startX, y, 16 * 3, 16);
    draw(vs[0], startX, y);
    startX += 16;
    draw(vs[1], startX, y);
    startX += 16;
    if (server == 1) {
        draw('star', startX, y);
    }
}

function draw(sn, x, y) {
    ctx.drawImage(
        sprites,
        spriteCoords[sn][0],
        spriteCoords[sn][1],
        spriteCoords[sn][2],
        spriteCoords[sn][3],
        x,
        y,
        spriteCoords[sn][2],
        spriteCoords[sn][3]
    );
}

function putShapes() {
    var sprite;
    if (oCoords) {
        ctx.clearRect(obx - 1, oby - 1, spriteCoords.ball1[2] + 2, spriteCoords.ball1[3] + 2);
        ctx.clearRect(olx - 1, oly - 1, spriteCoords.left1[2] + 2, spriteCoords.left1[3] + 2);
        ctx.clearRect(orx - 1, ory - 1, spriteCoords.right1[2] + 2, spriteCoords.right1[3] + 2);
    }
    sprite = "ball" + (Math.floor(tbx / 16) % 4 + 1);
    draw(sprite, tbx * 2 + 4, tby * 2);
    obx = tbx * 2 + 4;
    oby = tby * 2;

    if (y[0] < 173) {
        sprite = 'left3';
    } else {
        if (Math.floor(x[0] / 8) % 2) {
            sprite = 'left1';
        } else {
            sprite = 'left2';
        }
    }
    draw(sprite, x[0] * 2 + 4, y[0] * 2);
    olx = x[0] * 2 + 4;
    oly = y[0] * 2;

    if (y[1] < 173) {
        sprite = 'right3';
    } else {
        if (Math.floor(x[1] / 8) % 2) {
            sprite = 'right1';
        } else {
            sprite = 'right2';
        }
    }
    draw(sprite, x[1] * 2 + 4, y[1] * 2);
    orx = x[1] * 2 + 4;
    ory = y[1] * 2;

    oCoords = true;
}

function game() {
    if (mode == 'play'  || mode == 'menu') {
        rnd = (rnd * 5 + 1) % 32767;

        if (opts[0] == 'C') {
            computer0();
        }
        if (opts[1] == 'C') {
            computer1();
        }
        if (rMode) {
            if (rCnt-- > 0 || frameindex[0] != -1 || frameindex[1] != -1) {
                resetPt();
            } else {
                rMode = false;
                calculateScore();
            }
            return;
        }

        getPosition();

        if (serve) {
            doCollisions();
            putShapes();
            air = 1;
        } else {
            if (air) {
                doCollisions();
                air = moveBall();
                putShapes();
            }
        }
        if (!air || hits > 2) {
            setWinner();
            rMode = true;
            rCnt = 20;
        }
    }
}
