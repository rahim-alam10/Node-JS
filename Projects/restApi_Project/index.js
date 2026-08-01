const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { error } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();
const PORT = 8000;

// Connectong to Mongdb
mongoose.connect("mongodb://127.0.0.1:27017/backend")
        .then(()=> console.log("Mongodb Connected"))
        .catch((err) => console.log("Mongodb Connecting Error: ", err));


// Schema        
const userSchema = new mongoose.Schema({
    first_name :{
        type: String,
        required: true
    },
    last_namae : {
        type: String
    },
    age : {
        type: Number,
        required: true
    },
    gender : {
        type: String,
        required: true
    }

}, {timestamps: true}) 

const User = mongoose.model("user", userSchema)


// middleWare
app.use(express.urlencoded({extended: false}))

app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

    res.send(html);
});


app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user) return res.status(404).json({error: "User not found !!!"})
    return res.json(user)
})

app.post("/api/users", async (req, res) => {
    const body = req.body
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.age ||
        !body.gender
    ){
        return res.status(400).json({Message: "All fields are required...."})
    }
    const result = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        age: body.age,
        gender: body.gender
    })
    console.log("Result: ", result)

    return res.status(201).json({Message: "User Created Successfully !!!"})
})

app.listen(PORT, () => {
    console.log(`Server is listening at Port ${PORT}`);
});