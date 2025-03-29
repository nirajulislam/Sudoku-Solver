"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.post("/api/check", (req, res) => {
    const { puzzle, coordinate, value } = req.body;
  
    // Validate required fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
  
    // Validate puzzle length
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
  
    // Validate puzzle characters
    if (/[^1-9.]/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
  
    // Validate coordinate format
    const row = coordinate[0].toUpperCase();
    const col = coordinate.slice(1);
    if (!/[A-I]/.test(row) || !/^[1-9]$/.test(col)) {
      return res.json({ error: "Invalid coordinate" });
    }
  
    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }
  
    const solver = new SudokuSolver();
    const grid = solver.transform(puzzle);
    const rowIndex = solver.letterToNumber(row) - 1;
    const colIndex = parseInt(col, 10) - 1;
  
    // Check if the value is already placed at the given coordinate
    if (grid[rowIndex][colIndex] === parseInt(value, 10)) {
      return res.json({ valid: true });
    }
  
    // Check for conflicts
    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push("region");
  
    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }
  
    return res.json({ valid: true });
  });
    
  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }
    if (puzzle.length != 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution: solvedString });
    }
  });
};