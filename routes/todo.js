import express from "express";
import { nanoid } from "nanoid";

export default function setupTodoRouter(db) {
    const router = express.Router();

    //Create our GET route that just sends back the Todos data
    router.get("/", function (_request, response) {
        //The underscore means to ignore the param that's not being used
        response.status(200).json({
            //Set our response to have a status of 200 (OK!) and to respond with JSON
            success: true,
            todos: db.data.todos, //Returns the todos from our DB
        });
    });

    router.get("/:todo", function (request, response) {
        const todo = request.params.todo;
        console.log("THIS IS THE DYNAMIC TODO PARAM",todo);

        const currentTodo = db.data.todos.find(todoItem => todoItem.id === todo);

        response.status(200).json({
            success: true,
            todo: currentTodo
        });
    });

    router.post("/", function (request, response) {
        //Push the new todo
        db.data.todos.push({
            id: nanoid(4),
            name: request.body.todo,
        });

        //Save the todo to the "database"
        db.write();

        //Respond with 200 (OK!) and tell the user the request is successful
        response.status(200).json({
            success: true,
        });
    });

    router.put("/:todo", function (request, response) {
        // Express allows us to get the dynamic param(:todo) and it comes from request.params
        const todo = request.params.todo;
        console.log(todo);

        //Find where this todo exists within that todos array, db.data.todos array
        const todoIndex = db.data.todos.findIndex(currentTodo => currentTodo.id === todo);

        // Once we found that todo, we are going to index it Then we are going to get the name and we're going to change it to whatever the user has sent to us via the request.
        db.data.todos[todoIndex].name = request.body.todo;

        // Once the above has been changed, we want to make sure that gets written to the database
        db.write();

        //Then send the response back to the user
        response.status(200).json({
            success: true
        })
    });

    router.delete("/:todo", function (request, response) {
        const urlId = request.params.todo;
        console.log(urlId);

        //Find the place in which this todo is located. Using findIndex(method of arrays)returnd the position of the array. db.data.todos - going over the database of todo's/ It's just a JS array.
        const todoIndex = db.data.todos.findIndex(currentTodo => currentTodo.id === urlId);

        db.data.todos.splice(todoIndex, 1);

        db.write();

        response.status(200).json({
            success: true
        });
    });

    return router;
}

