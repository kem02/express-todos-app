import request from "supertest";
import createServer from "./server.js";

const server = await createServer();

describe("Just testing the server", function () {
    describe("Testing the /todo route", function () {
        // it.only - only tests that one route

        // Testing unauthorized route
        it("Should be unable to get todos without a flag", function (done) {
            request(server).get("/todo").expect(401).end((err) => {
                if (err) {
                    throw err;
                }
                else {
                    done();
                }
            })
        });

        // POST
        it("should be able to create a new todo", function (done) {
            request(server).post("/todo?admin=true").send({
                todo: "Clean the garage"
            }).set('Accept', 'application/json').expect(200).end(function (err, response) {
                if (err) {
                    throw err;
                } else {
                    // console.log(response)
                    expect(response.body).toEqual({ success: true });
                    done();
                }
            })
        });

        // GET one todo
        it("should be able to bring back one todo", function (done) {
            request(server).get("/todo/JOil?admin=true").expect(200).end((err, response) => {
                if (err) {
                    throw err;
                } else {
                    // console.log(response.body)
                    //This is Jest expect
                    // This means that you are checking the object entirely and looking for the key success
                    // expect(response.body).toHaveProperty("success");
                    // This means that you are checking the object entirely and looking for the key success AND checking if the value from the response.body.success has a value of true
                    expect(response.body).toHaveProperty("success", true);
                    expect(response.body).toHaveProperty("todo");
                    expect(response.body.todo).toHaveProperty("id", "JOil");
                    done();
                }
            })
        });

        //GET all todos
        it("should be able to bring back all todos", function (done) {
            request(server).get("/todo?admin=true").expect(200).end((err, response) => {
                if (err) {
                    throw err;
                } else {
                    // expect(response.body).toHaveProperty("success")
                    expect(response.body).toHaveProperty("success", true)
                    done();
                }
            })
        });

        //PUT
        it("should be able to edit/update a todo", function (done) {
            request(server).put("/todo/2zRX?admin=true").send({ todo: "Take a nap" }).expect(200)
                .end((err, response) => {
                    if (err) {
                        throw err;
                    } else {
                        // expect(response.body).toHaveProperty("success")
                        expect(response.body).toHaveProperty("success", true)
                        done();
                    }
                })
        });

        //DELETE
        it("should be able to delete a todo", function(done){
            request(server).delete("/todo/YV4o?admin=true").expect(200).end((err, response) => {
                if (err) {
                    throw err;
                } else {
                    expect(response.body).toEqual({ success: true });
                    done();
                }
            })
        });


    })





})