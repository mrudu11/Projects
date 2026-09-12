import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        rollNumber: "",
        department: "",
        marks: ""
    });

    const [editId, setEditId] = useState(null);


    // Get all students
    const fetchStudents = async () => {

        const response = await fetch(
            "http://localhost:5000/api/students"
        );

        const data = await response.json();

        setStudents(data);
    };


    useEffect(() => {
        fetchStudents();
    }, []);


    // Handle input
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // Add or Update
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.name ||
            !formData.rollNumber ||
            !formData.department ||
            !formData.marks
        ) {
            alert("Please fill all fields");
            return;
        }


        if (editId) {

            // UPDATE
            await fetch(
                `http://localhost:5000/api/students/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            alert("Student updated successfully");

            setEditId(null);

        } else {

            // CREATE
            await fetch(
                "http://localhost:5000/api/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            alert("Student added successfully");
        }


        setFormData({
            name: "",
            rollNumber: "",
            department: "",
            marks: ""
        });

        fetchStudents();
    };


    // Edit
    const editStudent = (student) => {

        setFormData({
            name: student.name,
            rollNumber: student.rollNumber,
            department: student.department,
            marks: student.marks
        });

        setEditId(student.id);
    };


    // Delete
    const deleteStudent = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        await fetch(
            `http://localhost:5000/api/students/${id}`,
            {
                method: "DELETE"
            }
        );

        alert("Student deleted successfully");

        fetchStudents();
    };


    // Cancel update
    const cancelEdit = () => {

        setEditId(null);

        setFormData({
            name: "",
            rollNumber: "",
            department: "",
            marks: ""
        });
    };


    return (

        <div className="container">

            <h1>Student Management System</h1>


            {/* Student Form */}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="rollNumber"
                    placeholder="Roll Number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="marks"
                    placeholder="Marks"
                    value={formData.marks}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editId
                        ? "Update Student"
                        : "Add Student"}
                </button>


                {editId && (

                    <button
                        type="button"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>

                )}

            </form>


            {/* Student List */}

            <h2>Student List</h2>

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>

                </thead>


                <tbody>

                    {students.map((student) => (

                        <tr key={student.id}>

                            <td>{student.id}</td>

                            <td>{student.name}</td>

                            <td>{student.rollNumber}</td>

                            <td>{student.department}</td>

                            <td>{student.marks}</td>

                            <td>

                                <button
                                    onClick={() =>
                                        editStudent(student)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteStudent(student.id)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default App;