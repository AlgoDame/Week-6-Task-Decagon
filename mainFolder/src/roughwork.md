import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("/api/courses", (req, res) => {
    res.send(courses)
})


const courses = [   { id: 1, name: "course1" },
{ id: 2, name: "course2" },
{ id: 3, name: "course3" },
{ id: 4, name: "course4" }
]

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given id was not found");
    res.send(course); 
})

app.get("/api/posts/:year/:month", (req, res) => {
    res.send(req.params);
})

app.post("/api/courses", (req, res)=>{
   if(!req.body.name || req.body.name.length < 3) return res.status(400).send("Name is required and should be minimum of 3 characters")

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);
    res.send(course);


})

app.put("/api/courses/:id", (req, res)=>{
    // look up the course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return  res.status(400).send("Course does not exist");
    // validate
    // if invalid return 400, bad request
    if(!req.body.name || req.body.name.length < 3) return res.status(400).send("Name is required and should be a minimum of 3 characters");
    // update course
    // return the updated course
    if(course) {
        course.name = req.body.name;
        res.send(course);
    }
    

})

app.delete("/api/courses/:id", (req, res)=>{
    // look up the course
    // not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    console.log(course)
    if(!course) return res.status(404).send("Course does not exist");
    // delete
    if(course){
        const index = courses.indexOf(course);
        courses.splice(index, 1);
    }
    // return the same course
    res.send(course);
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})