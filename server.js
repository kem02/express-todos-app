import express from "express"; //Import Express
import { Low } from "lowdb"; //Import the LowDB module. Uses a JSON file to create our "database"
import { JSONFile } from "lowdb/node";

import morgan from "morgan";

import setupTodoRouter from "./routes/todo.js"

export default async function createServer() {
  // Configure lowdb to write to JSONFile. This will be our "database"
  const adapter = new JSONFile("db.json");
  const db = new Low(adapter);

  //Reads the database
  await db.read();

  //Checks if there is any data in the database. If not, we give default data.
  db.data = db.data || { todos: [] };

  //This writes to the database if there are any changes
  await db.write();

  //Instantiate our express application
  const app = express();

  //Use Builtin middleware to extract JSON data from the body of any request made to the server
  app.use(express.json());

  app.use(morgan("tiny"));

  // Middleware specified only to the root or /todo
  app.use("/todo", function(request, response, next){
    if(request.query.admin === "true"){
        next();
    }
    else{
        // You can send back a message of Unauthorized with the code below.
        // response.status(401).send("Unauthorized");
        response.status(401).json({
          success: false,
        });
    }
    console.log("Hello Middleware!")
  });

  // "/" => "/todo"
  // "/:todo" => "/todo/:todo"
  app.use("/todo", setupTodoRouter(db));

//   //Create our GET route that just sends back the Todos data
//   app.get("/todo", function (_request, response) {
//     //The underscore means to ignore the param that's not being used
//     response.status(200).json({
//       //Set our response to have a status of 200 (OK!) and to respond with JSON
//       success: true,
//       todos: db.data.todos, //Returns the todos from our DB
//     });
//   });


// app.get("/todo/:todo", function(request, response){
//     const todo = request.params.todo;

//     const currentTodo = db.data.todos.find(todoItem => todoItem.id === todo);

//     response.status(200).json({
//         success: true,
//         todo: currentTodo
//     });
//   });


//   app.post("/todo", function (request, response) {
//     //Push the new todo
//     db.data.todos.push({
//         id: nanoid(4),
//         name: request.body.todo,
//     });

//     //Save the todo to the "database"
//     db.write();

//     //Respond with 200 (OK!) and tell the user the request is successful
//     response.status(200).json({
//       success: true,
//     });
//   });

//   app.put("/todo/:todo", function(request, response){
//     // Express allows us to get the dynamic param(:todo) and it comes from request.params
//     const todo = request.params.todo;
//     console.log(todo);

//     //Find where this todo exists within that todos array, db.data.todos array
//     const todoIndex = db.data.todos.findIndex(currentTodo => currentTodo.id === todo);

//     // Once we found that todo, we are going to index it Then we are going to get the name and we're going to change it to whatever the user has sent to us via the request.
//     db.data.todos[todoIndex].name = request.body.todo;

//     // Once the above has been changed, we want to make sure that gets written to the database
//     db.write();

//     //Then send the response back to the user
//     response.status(200).json({
//         success: true
//     })
//   });

//   app.delete("/todo/:todo", function(request, response){
//     const urlId = request.params.todo;
//     console.log(urlId);

//     //Find the place in which this todo is located. Using findIndex(method of arrays)returnd the position of the array. db.data.todos - going over the database of todo's/ It's just a JS array.
//     const todoIndex = db.data.todos.findIndex(currentTodo => currentTodo.id === urlId);

//     db.data.todos.splice(todoIndex, 1);

//     db.write();

//     response.status(200).json({
//         success: true
//     })
//   })

  // //Have the app listen on port 8080
  // app.listen(8080, function () {
  //   //After the app is running, run this console.log
  //   console.log("App running on http://localhost:8080");
  // });

  return app;
};