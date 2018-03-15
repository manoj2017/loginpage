'use strict';
const Mongodb = require("./db");

const self = {
    createUser: function(data, callback) {
        var response = {};
        const userInfo = {
            "email": data.email
        };
        Mongodb.onConnect(function(db, ObjectID) {
            db.collection('Verify').findOne(data, function(err, result) {
                if (err) {
                    response.process = false;
                    response.isUserExists = false;
                    response.message = "Something went Wrong,try after sometime.";
                } else {
                    if (result != null) {
                        response.process = true;
                        response.isUserExists = true;
                        response.message = "User already exists.";
                        callback(response);
                    } else {
                        db.collection('Verify').insertOne(data, function(err, result) {
                            if (err) {
                                response.process = false;
                                response.isUserExists = false;
                                response.isUserAdded = false;
                                response.message = "Something went Wrong,try after sometime.";
                            } else {
                                response.process = true;
                                response.isUserExists = false;
                                response.isUserAdded = true;
                                response.id = result.ops[0]._id;
                                response.message = "User added.";
                            }
                            callback(response);
                        });
                    }
                }
            });
        });
    },
    isUserExists: function(data, callback) {
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            db.collection('Verify').findOne(data, function(err, result) {
                if (result != null) {
                    response.process = "success";
                    response.isUserExists = true;
                    response.id = result._id;
                } else {
                    response.process = "failed";
                    response.isUserExists = false;
                }
                callback(response);
            });
        });
    },
    getUserInfo: function(data, callback) {
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            data._id = new ObjectID(data._id);
            db.collection('Verify').findOne(data, function(err, result) {
                if (result != null) {
                    response.process = "success";
                    result.mobile = (result.mobile).substr((result.mobile).length - 4);
                    response.data = {
                        username: result.username,
                        isVerified: result.isVerified,
                        mobile: result.mobile,
                        email: result.email
                    };
                } else {
                    response.process = "failed";
                    response.isUserExists = false;
                }
                callback(response);
            });
        });
    }
}
module.exports = self;