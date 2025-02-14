// components/GameCanvas.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GameCanvas = () => {
  // Refs for canvas and container (for responsive sizing)
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Game objects stored in refs to avoid unnecessary re-renders
  const playerRef = useRef({
    x: 50,
    y: 0,
    width: 50,
    height: 50,
    vy: 0,
  });
  const obstaclesRef = useRef([]);
  const powerUpsRef = useRef([]);
  const particlesRef = useRef([]);
  // Parallax background offset refs
  const bgLayer1Ref = useRef({ x: 0 });
  const bgLayer2Ref = useRef({ x: 0 });
  // Preload background images (ensure these images exist in public/images/)
  const bgLayer1 = useRef(null);
  const bgLayer2 = useRef(null);

  // Game state variables
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(4);
  const [paused, setPaused] = useState(false);
  // For responsive canvas sizing
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  // Game configuration constants
  const gravity = 0.6;
  const obstacleInterval = 1500; // milliseconds
  const powerUpInterval = 5000; // milliseconds
  const difficultyInterval = useRef(0);

  // ----------------------------
  // Responsive Canvas Setup
  // ----------------------------
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        // Use container’s width; maintain a 2:1 width-to-height ratio
        const width = containerRef.current.clientWidth;
        const height = width / 2;
        setCanvasSize({ width, height });
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // ----------------------------
  // High Score Initialization
  // ----------------------------
  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore") || 0;
    setHighScore(parseInt(storedHighScore, 10));
  }, []);

  // ----------------------------
  // Preload Parallax Background Images
  // ----------------------------
  useEffect(() => {
    bgLayer1.current = new Image();
    bgLayer1.current.src = "/images/layer1.jpg";
    bgLayer2.current = new Image();
    bgLayer2.current.src = "/images/layer2.jpg";
  }, []);

  // ----------------------------
  // Particle Explosion on Collision
  // ----------------------------
  const spawnParticles = (x, y) => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 3 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: Math.random() * 30 + 30, // lifetime in milliseconds
        alpha: 1,
      });
    }
    particlesRef.current.push(...particles);
  };

  // ----------------------------
  // Main Game Loop
  // ----------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastTime = performance.now();
    let obstacleTimer = 0;
    let powerUpTimer = 0;

    const gameLoop = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      // Clear the entire canvas for fresh drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Parallax Background Layers
      // --- Layer 1 (Furthest; moves slowest) ---
      const bgSpeed1 = gameSpeed * 0.3;
      bgLayer1Ref.current.x -= bgSpeed1 * (deltaTime / 16);
      if (bgLayer1Ref.current.x <= -canvas.width) {
        bgLayer1Ref.current.x = 0;
      }
      if (bgLayer1.current.complete) {
        ctx.drawImage(bgLayer1.current, bgLayer1Ref.current.x, 0, canvas.width, canvas.height);
        ctx.drawImage(bgLayer1.current, bgLayer1Ref.current.x + canvas.width, 0, canvas.width, canvas.height);
      }
      // --- Layer 2 (Closer; moves a bit faster) ---
      const bgSpeed2 = gameSpeed * 0.6;
      bgLayer2Ref.current.x -= bgSpeed2 * (deltaTime / 16);
      if (bgLayer2Ref.current.x <= -canvas.width) {
        bgLayer2Ref.current.x = 0;
      }
      if (bgLayer2.current.complete) {
        ctx.drawImage(bgLayer2.current, bgLayer2Ref.current.x, 0, canvas.width, canvas.height);
        ctx.drawImage(bgLayer2.current, bgLayer2Ref.current.x + canvas.width, 0, canvas.width, canvas.height);
      }

      // 2. Draw Score & High Score
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px 'Helvetica Neue', sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`High Score: ${highScore}`, 10, 60);

      // 3. Update and Draw Game Objects (only when not paused and game is active)
      if (!paused && !gameOver) {
        // Increase difficulty over time
        difficultyInterval.current += deltaTime;
        if (difficultyInterval.current > 10000) {
          setGameSpeed((prev) => prev + 0.5);
          difficultyInterval.current = 0;
        }

        // Update and draw the player
        const player = playerRef.current;
        player.y += player.vy;
        player.vy += gravity;
        if (player.y > canvas.height - player.height) {
          player.y = canvas.height - player.height;
          player.vy = 0;
        }
        ctx.fillStyle = "#ff4081";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Spawn new obstacles periodically
        obstacleTimer += deltaTime;
        if (obstacleTimer > obstacleInterval) {
          const height = Math.random() * 30 + 20;
          obstaclesRef.current.push({
            x: canvas.width,
            y: canvas.height - height,
            width: 20,
            height: height,
            speed: gameSpeed,
          });
          obstacleTimer = 0;
        }

        // Spawn new power-ups periodically
        powerUpTimer += deltaTime;
        if (powerUpTimer > powerUpInterval) {
          powerUpsRef.current.push({
            x: canvas.width,
            y: canvas.height - 100 - Math.random() * 150,
            width: 20,
            height: 20,
            speed: gameSpeed,
            collected: false,
          });
          powerUpTimer = 0;
        }

        // Update obstacles
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obstacle = obstaclesRef.current[i];
          obstacle.x -= obstacle.speed * (deltaTime / 16);

          // Collision detection with the player
          const player = playerRef.current;
          if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
          ) {
            // Spawn a particle explosion at the player's center on first collision
            if (!gameOver) {
              spawnParticles(player.x + player.width / 2, player.y + player.height / 2);
            }
            setGameOver(true);
          }

          // Remove obstacles that have moved off-screen and update the score
          if (obstacle.x + obstacle.width < 0) {
            obstaclesRef.current.splice(i, 1);
            setScore((prev) => prev + 1);
          } else {
            ctx.fillStyle = "#00bcd4";
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          }
        }

        // Update power-ups
        for (let i = powerUpsRef.current.length - 1; i >= 0; i--) {
          const powerUp = powerUpsRef.current[i];
          powerUp.x -= powerUp.speed * (deltaTime / 16);
          // Check for collision with the player
          const player = playerRef.current;
          if (
            !powerUp.collected &&
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
          ) {
            powerUp.collected = true;
            setScore((prev) => prev + 5);
          }
          if (powerUp.x + powerUp.width < 0) {
            powerUpsRef.current.splice(i, 1);
          } else if (!powerUp.collected) {
            ctx.fillStyle = "#ffc107";
            ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
          }
        }
      } else {
        // When paused (or game over), draw the player in its current position
        const player = playerRef.current;
        ctx.fillStyle = "#ff4081";
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }

      // 4. Update and Draw Particle Effects (always update particles)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.lifetime -= deltaTime;
        particle.alpha = particle.lifetime / 60; // Adjust alpha based on remaining lifetime
        if (particle.lifetime <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Draw Game Over Overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "40px 'Helvetica Neue', sans-serif";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, gameOver, score, gameSpeed, highScore]);

  // ----------------------------
  // Handle Keyboard Input
  // ----------------------------
  const handleKeyDown = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      const canvas = canvasRef.current;
      const player = playerRef.current;
      // Allow jump only if the player is on the ground
      if (player.y >= canvas.height - player.height) {
        player.vy = -12;
      }
    }
    if (e.code === "KeyP") {
      setPaused((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ----------------------------
  // Update High Score When Game Ends
  // ----------------------------
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        localStorage.setItem("highScore", score);
        setHighScore(score);
      }
    }
  }, [gameOver, score, highScore]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-800 flex flex-col items-center justify-center p-4"
    >
      <canvas
        ref={canvasRef}
        className="border-4 border-white rounded-lg shadow-2xl bg-gray-900 w-full max-w-4xl"
      />
      <div className="mt-4 flex space-x-4">
        {gameOver ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Restart
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPaused((prev) => !prev)}
            className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            {paused ? "Resume" : "Pause"}
          </motion.button>
        )}
      </div>
      <p className="mt-2 text-white text-sm text-center">
        Use <strong>Space</strong> or <strong>Arrow Up</strong> to jump. Press{" "}
        <strong>P</strong> to pause/resume.
      </p>
    </div>
  );
};

export default GameCanvas;
