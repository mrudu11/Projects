const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// GET - Display all students
// ===============================

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(result);
    });
});


// ===============================
// POST - Add Student
// ===============================

app.post("/api/students", (req, res) => {

    const { name, rollNumber, department, marks } = req.body;

    const sql = `
        INSERT INTO students
        (name, rollNumber, department, marks)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, rollNumber, department, marks],
        (err, result) => {

            if (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                id: result.insertId
            });
        }
    );
});


// ===============================
// PUT - Update Student
// ===============================

app.put("/api/students/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        rollNumber,
        department,
        marks
    } = req.body;

    const sql = `
        UPDATE students
        SET name = ?,
            rollNumber = ?,
            department = ?,
            marks = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, rollNumber, department, marks, id],
        (err, result) => {

            if (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});


// ===============================
// DELETE - Delete Student
// ===============================

app.delete("/api/students/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});


// ===============================
// Start Server
// ===============================

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});