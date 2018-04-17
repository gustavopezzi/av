var canvas;
var canvasContext;
var left;
var right;
var ball;

var spriteCoords = {
    'left1': [0, 402, 60, 52],
    'left2': [60, 402, 60, 52],
    'left3': [120, 402, 60, 52],
    'ball1': [180, 402, 50, 42],
    'ball2': [230, 402, 50, 42],
    'ball3': [280, 402, 50, 42],
    'ball4': [330, 402, 50, 42],
    'right1': [380, 402, 60, 52],
    'right2': [440, 402, 60, 52],
    'right3': [500, 402, 60, 52],
    '0': [560, 402, 16, 16],
    '1': [576, 402, 16, 16],
    '2': [592, 402, 16, 16],
    '3': [608, 402, 16, 16],
    '4': [624, 402, 16, 16],
    '5': [560, 418, 16, 16],
    '6': [576, 418, 16, 16],
    '7': [592, 418, 16, 16],
    '8': [608, 418, 16, 16],
    '9': [524, 418, 16, 16],
    'star': [560, 434, 16, 16]
}

var ldCount = 0;

var intervalId;

var speed = 50;

var rMode = false;
var rCnt;
var winner;
var tVelX, tVelY;

var x = [0, 0];
var y = [0, 0];

var px = [0, 0];
var frame = [0, 0];
var frameIndex = [0, 0];
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
var servevel;
var compserve = 0;
var hits;
var hitter;
var starter;
var gravity;
var sstage;
var bytop;
var rnd;
var endGame;
var menuOn;
var jFlag;
var polecol = [0, 1, 2, 3, 3, 4, 6, 7, 9, 14];
var jump = [-4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4];
var keyMove = [{}, {}];
var options = ['C', 'C'];

var olx;
var oly;
var orx;
var ory;
var obx;
var oby;

var oCoords = false;

var mode;

$(document).ready(function() {
    canvas = $("#viewport");
    canvasContext = canvas[0].getContext("2d");
    $(document).keydown(onKey);
    $(document).keyup(clearKeys);

    $('#play').click(function() {
        options[0] = 'H';
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
        case 72: {
            $('#help').toggle();
            break;
        }
    }
}

function getPosition() {
    var i, tx, velx, bnd;

    for (i = 0; i < 2; i++) {
        if (keyMove[i].up && frameIndex[i] == -1) {
            frameIndex[i] = 0;
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
            if (tx > bnd) {
                x[i] = tx;
            } else {
                x[i] = bnd;
            }
        }
        if (frameIndex[i] == -2) {
            y[i] = 173;
            frame[i] = 0;
            frameIndex[i] = -1;
        }
        if (frameIndex[i] == -1) {
            if (velx != 0) {
                if (Math.abs(px[i] - x[i]) > 4) {
                    frame[i] ^= 1;
                    px[i] = x[i];
                }
            } else {
                frame[i] = 0;
            }
        } else {
            frame[i] = 2 + (frameIndex[i] > 18);
            if (frameIndex[i] == 19) {
                y[i] -= 4;
            }
            y[i] += jump[frameIndex[i]++];
            if (frameIndex[i] > 37) {
                frameIndex[i] = -2;
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
        server = winner;
        putScore();
    }
    putScore();
    bx = (tbx = pbx = (64 + winner * 165)) << 6;
    by = (tby = pby = 135) << 6;
    bFrame = bLogic = bVelX = bVelY = hits = rebound[0] = rebound[1] = 0;
    bIndex = 6;
    serve = servevel = 1;
    hitter = 2;
    compserve = Math.abs(rnd) % 5;
    if (score[server] == 14) {
        compserve = 5;
    }
    sstage = 0;
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
    var rbVelX, rbVelY, hitFloor;
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
    if (bx < 320) {
        bx = 320;
        rbVelX = -rbVelX;
        rbVelX -= rbVelX >> 4;
        rbVelY -= rbVelY >> 4;
        if (hitter == 1) {
            hitter = 2;
            hits = 0;
        }
    }
    if (bx > 18112) {
        bx = 18112;
        rbVelX = -rbVelX;
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
    if (rbVelY > 0) {
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
    var i, dx, dy, dist, rndoff, avy, jif, per;

    for (i = 0; i < 2; i++) {
        dx = tbx - x[i] - i * 7;
        dy = tby - y[i] >> 1;
        dist = (dx >> 2) * dx + dy * dy;
        if (dist < 110) {
            rndoff = 8 - (rnd & 15);
            if (frameIndex[i] > -1) {
                bVelY = -Math.abs(bVelY) + (jump[frameIndex[i]] << (3 << servevel));
            } else {
                bVelY = -Math.abs(bVelY);
            }
            bVelY += rndoff;
            bVelX += dx * Math.abs(dx) + (keyMove[i].right + keyMove[i].left << (4 + servevel)) + rndoff;
            if (!rebound[i]) {
                if (!menuOn) {
                    avy = Math.abs(320 - Math.abs(bVelY));
                    per = 300 + avy;
                    jif = per >> 5;
                }
                bytop = 200;
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
            if (rebound[i]) rebound[i] = servevel = 0;
        }
    }
    i = 1;
    if (tby > 91) {
        if (pbx < 128 && tbx > 127) {
            bVelX = -Math.abs(bVelX) >> 1;
            bx = 127 * 64;
            i = 0;
        } else
        if (pbx > 159 && tbx < 160) {
            bVelX = Math.abs(bVelX) >> 1;
            bx = 160 * 64;
            i = 0;
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
            if ((tbx > 147 && 161 - tbx >= polecol[91 - tby]) || (tbx < 148 && tbx - 133 >= polecol[91 - tby])) {
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
    var yStep, destX, dx, rndoff, dest;
    keyMove[0].up = 0;
    if (tby < bytop) {
        bytop = tby;
    }
    rndoff = 5 - rnd % 10;
    if (serve && ((server & 1) == 0)) {
        switch (compserve) {
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
                if (sstage == 0) {
                    if (dest = destination(0, 44, 2)) {
                        sstage = 1;
                    }
                } else {
                    destination(0, 58, 2);
                    dest = 1;
                }
                break;
            }
            case 4: {
                if (sstage == 0) {
                    if (dest = destination(0, 90, 2)) {
                        sstage = 1;
                    }
                } else {
                    destination(0, 58, 2);
                    dest = 1;
                }
                break;
            }
            case 5: {
                if (sstage == 0) {
                    if (destination(0, 3, 2)) {
                        sstage = 1;
                    }
                    dest = 0;
                } else {
                    destination(0, 8 + sstage++, 1);
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
            }
            if (yStep < 1 || (bVelX >> 6) == 0) {
                destX = tbx;
            } else {
                destX = tbx + (bVelX >> 6) * yStep - 4;
            }
            dx = x[0] - tbx;
            if (Math.abs(bVelX) < 128 && bytop < 75) {
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
                        destination(0, tbx + rndoff + (x[0] - 60 >> 3), 10);
                        keyMove[0].up = x[0] < 105 && (hitter != 0 || hits < 2);
                    }
                } else {
                    if (destX < 3) {
                        destX = 6 - destX;
                    }
                    if (destX > 123) {
                        destX = 246 - destX;
                    }
                    destination(0, destX + rndoff, 3);
                }
            }
        } else {
            destination(0, 56, 8);
        }
    }
}

function computer1() {
    var yStep, destX, dx, rndoff, dest;
    keyMove[1].up = 0;
    if (tby < bytop) {
        bytop = tby;
    }
    rndoff = 5 - rnd % 10;
    if (serve && ((server & 1) == 1)) {
        switch (compserve) {
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
                if (sstage == 0) {
                    if (dest = destination(1, 250, 2)) {
                        sstage = 1;
                    }
                } else {
                    destination(1, 220, 2);
                    dest = 1;
                }
                break;
            }
            case 4: {
                if (sstage == 0) {
                    if (dest = destination(1, 190, 2)) {
                        sstage = 1;
                    }
                } else {
                    destination(1, 230, 2);
                    dest = 1;
                }
                break;
            }
            case 5: {
                if (sstage == 0) {
                    if (destination(1, 277, 2)) {
                        sstage = 1;
                    }
                    dest = 0;
                } else {
                    destination(1, 272 - sstage++, 1);
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
            if (Math.abs(bVelX) < 128 && bytop < 75) {
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
                        destination(1, tbx - rndoff - (x[1] - 218 >> 3), 10);
                        keyMove[1].up = x[1] > 175 && (hitter != 1 || hits < 2);
                    }
                } else {
                    if (destX < 158) {
                        destX = 316 - destX;
                    }
                    if (destX > 277) {
                        destX = 554 - destX;
                    }
                    destination(1, destX - rndoff, 3);
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
    bytop = 200;
    x[0] = 64;
    x[1] = 226;
    tbx = 400;
    for (i = 0; i < 2; i++) {
        px[i] = x[i];
        y[i] = 173;
        frameIndex[i] = -1;
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
    serve = servevel = 1;
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
    var startx = 64;
    if (vs.length < 2) {
        vs = "0" + vs;
    }
    startx = 64;
    canvasContext.clearRect(startx, y, 16 * 3, 16);
    draw(vs[0], startx, y);
    startx += 16;
    draw(vs[1], startx, y);
    startx += 16;
    if (server == 0) {
        draw('star', startx, y);
    }
    vs = "" + score[1];
    if (vs.length < 2) vs = "0" + vs;
    startx = 528;
    canvasContext.clearRect(startx, y, 16 * 3, 16);
    draw(vs[0], startx, y);
    startx += 16;
    draw(vs[1], startx, y);
    startx += 16;
    if (server == 1) {
        draw('star', startx, y);
    }
}

function draw(sn, x, y) {
    canvasContext.drawImage(
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
        canvasContext.clearRect(obx - 1, oby - 1, spriteCoords.ball1[2] + 2, spriteCoords.ball1[3] + 2);
        canvasContext.clearRect(olx - 1, oly - 1, spriteCoords.left1[2] + 2, spriteCoords.left1[3] + 2);
        canvasContext.clearRect(orx - 1, ory - 1, spriteCoords.right1[2] + 2, spriteCoords.right1[3] + 2);
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
    if (mode == 'play' || mode == 'menu') {
        rnd = (rnd * 5 + 1) % 32767;

        if (options[0] == 'C') {
            computer0();
        }
        if (options[1] == 'C') {
            computer1();
        }
        if (rMode) {
            if (rCnt-- > 0 || frameIndex[0] != -1 || frameIndex[1] != -1) {
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
