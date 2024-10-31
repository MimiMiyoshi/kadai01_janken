$(document).ready(function () {
    const symbols = ["🍒", "🍋", "🍇", "🍉", "⭐", "🍀"];

    function spinReel() {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        return symbols[randomIndex];
    }

    function animateReel(reelId) {
        const reelElement = $(`#${reelId}`);
        let currentSymbolIndex = 0;

        const interval = setInterval(() => {
            currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
            reelElement.text(symbols[currentSymbolIndex]);
        }, 100);

        return interval;
    }

    function stopReel(interval, reelId) {
        clearInterval(interval);
        const finalSymbol = spinReel();
        $(`#${reelId}`).text(finalSymbol);
        return finalSymbol;
    }

    function launchFireworks() {
        const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        function Particle(x, y) {
            this.x = x;
            this.y = y;
            this.speed = Math.random() * 6 + 4;
            this.angle = Math.random() * Math.PI * 2;
            this.size = Math.random() * 5 + 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.alpha = 1;

            this.update = function () {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.size *= 0.96;
                this.alpha -= 0.01;
            };

            this.draw = function () {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };
        }

        function createFirework(x, y) {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(x, y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                if (particle.alpha <= 0 || particle.size <= 0.5) {
                    particles.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        function launchMultipleFireworks() {
            const interval = setInterval(() => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height / 2;
                createFirework(x, y);
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 10000);
        }

        launchMultipleFireworks();
        animate();
    }

    $('#startButton').click(function () {
        $('#result').text("");

        const interval1 = animateReel('reel1');
        const interval2 = animateReel('reel2');
        const interval3 = animateReel('reel3');

        setTimeout(() => {
            const reel1 = stopReel(interval1, 'reel1');
            setTimeout(() => {
                const reel2 = stopReel(interval2, 'reel2');
                setTimeout(() => {
                    const reel3 = stopReel(interval3, 'reel3');

                    if (reel1 === reel2 && reel2 === reel3) {
                        $('#result').text("おめでとう！大当たり！");
                        launchFireworks();
                    } else {
                        $('#result').text("残念！もう一度挑戦してね❤︎");
                    }
                }, 1000);
            }, 1000);
        }, 1000);
    });
});
