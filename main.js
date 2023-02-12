import createServer from "./server.js";

const app = await createServer();

//Have the app listen on port 8080
app.listen(8080, function () {
    //After the app is running, run this console.log
    console.log("App running on http://localhost:8080");
});