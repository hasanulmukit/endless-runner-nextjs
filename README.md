# Endless Runner Game

An endless runner game built with **Next.js** and **Tailwind CSS** that leverages modern web technologies to deliver an engaging, responsive, and visually appealing gaming experience. The game features parallax background effects, sprite-based characters and obstacles, audio effects, particle effects on collisions, and a high score system stored in local storage.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Responsive Design:** The canvas automatically adjusts to different screen sizes while maintaining a 2:1 aspect ratio.
- **Parallax Background:** Multiple canvas layers create a depth effect using moving background images.
- **High Score System:** High scores are stored locally to track your best performance.
- **Particle Effects:** Visual particle explosions occur on collision events for a dynamic effect.
- **Modern UI Animations:** Framer Motion is used to animate UI elements like buttons for a smooth user experience.

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/endless-runner-game.git
   cd endless-runner-game
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

4. **Open Your Browser:**

Visit http://localhost:3000 to play the game.

## Usage

- Controls:

1. Press Space or Arrow Up to jump.
2. Press P to pause/resume the game.

## Objective:

Keep your character running, dodge obstacles, and collect power-ups to score points. Your high score is saved automatically.

## Technologies

- Next.js: React framework for production.
- Tailwind CSS: Utility-first CSS framework for styling.
- HTML5 Canvas: Rendering the game graphics.
- Framer Motion: For UI animations.
- JavaScript (ES6+): Game logic and interactivity.

## Project Structure

- endless-runner-game/
- ├── app/
- │ ├── layout.jsx // Global layout and metadata
- │ └── page.jsx // Home page that renders the game
- ├── components/
- │ └── GameCanvas.jsx // Main game component with game logic
- ├── public/
- │ ├── audio/ // Audio files (jump, collision, power-up)
- │ ├── images/ // background images
- │ └── favicon.ico
- ├── styles/
- │ └── globals.css // Global CSS including Tailwind directives
- ├── package.json
- └── README.md

### Contributing

Contributions are welcome! Please fork this repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

- Fork the project.
- Create your feature branch: git checkout -b feature/my-feature
- Commit your changes: git commit -am 'Add new feature'
- Push to the branch: git push origin feature/my-feature
- Open a pull request.

### License

This project is licensed under the MIT License.
