### https://schakibb.github.io/Tic-Tac-Toe-vs-Computer/

# Tic Tac Toe Game

This is a simple Tic Tac Toe game implemented in JavaScript. It allows the player to play against the computer. The player can choose either "❌" or "⭕" symbols to play with.
#### (its hard to win)
### In the future i will add some options to the game like 'hard medium easy' and play vs friend.

## Table of Contents

- [Features](#features)
- [How to Play](#how-to-play)
- [Game Logic](#game-logic)

## Features

- Player can choose "❌" or "⭕" symbols.
- Play against the computer.
- Keep track of scores.
- Display winner or draw.

## How to Play

1. When you open the game, you'll be prompted to choose your symbol ("❌" or "⭕").
2. Once you choose, the game starts.
3. Click on any empty cell to make a move.
4. Try to get three of your symbols in a row horizontally, vertically, or diagonally to win.
5. If there is no empty cell left and no winner, the game ends in a draw.

## Game Logic

The game logic includes:

- Checking for winning combinations after each move.
- Blocking the player or attempting to win if two symbols of the same kind are in a row.
- Prioritizing the center and corners for initial moves to increase the chances of winning or preventing the player from winning.
