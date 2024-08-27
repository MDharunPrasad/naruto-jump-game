import kaboom from "kaboom";

// Initialize context
kaboom();

// Load assets
loadSprite("naruto", "sprites/naruto.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
// Load sounds
loadSound("jump", "sounds/jump.mp3");
loadSound("bruh", "sounds/bruh.mp3");
loadSound("pass", "sounds/pass.mp3");
loadSound("end","sounds/end.mp3");

let highScore = 0;

// Game scene
scene("game", () => {
    const PIPE_GAP = 110;
    let score = 0;
    setGravity(1600);

    // Add background image
    add([sprite("bg", { width: width(), height: height() })]);

    const scoreText = add([text(score), pos(15, 15)]);

    const player = add([sprite("naruto"), scale(1.2), pos(100,50), area(), body()]);

    function createPipes() {
        const offset = rand(-50, 50);
        // Bottom pipe
        add([
            sprite("pipe"),
            pos(width(), height() / 2 + offset + PIPE_GAP / 2),
            "pipe",
            scale(2),
            area(),
            { passed: false },
        ]);

        // Top pipe
        add([
            sprite("pipe", { flipY: true }),
            pos(width(), height() / 2 + offset - PIPE_GAP / 2),
            "pipe",
            anchor("botleft"),
            scale(2),
            area(),
        ]);
    }

    loop(1.5, () => createPipes());

    onUpdate("pipe", (pipe) => {
        pipe.move(-300, 0);

        if (pipe.passed === false && pipe.pos.x < player.pos.x) {
            pipe.passed = true;
            score += 1;
            scoreText.text = score;
            play("pass");
        }
    });

    player.onCollide("pipe", () => {
        play("bruh");
        go("gameover", score);
    });

    player.onUpdate(() => {
        if (player.pos.y > height()) {
            go("gameover", score);
        }
    });

    onKeyPress("space", () => {
        play("jump");
        player.jump(400);
    });

    // For touch
    window.addEventListener("touchstart", () => {
        play("jump");
        player.jump(400);
    });
    
});

// Game over scene
scene("gameover", (score) => {
    
    if (score > highScore) highScore = score;
play("bruh");
   

    // Add background image
    add([sprite("bg", { width: width(), height: height() })]);

    add([
        text("Game Over Naruto!\nScore: " + score + "\nHigh Score: " + highScore, { size: 45 }),
        pos(width() / 2, height() / 3),
        anchor("center"),  // Use anchor instead of origin
    ]);

    onKeyPress("space", () => {
        go("game");
    });
});

// Start the game
go("game");
play("end");

