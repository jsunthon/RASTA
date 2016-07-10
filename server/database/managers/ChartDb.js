var moment = require('moment');
var APIFunction = require('./../models/api_function.js');
var TestResult = require('./../models/test_result.js');

function ChartDbManager() {
    /**
     * Return data for overall service availability
     * @param res
     */
    this.retrieveOverallResults = function () {
        if (db.readyState !== 1 && db.readyState !== 3) {
            db.once('connected', retrieveResults);
        } else if (db.readyState === 1) {
            return retrieveResults();
        }
        function retrieveResults() {
            return new Promise(function(resolve, reject) {
                TestResult.aggregate(
                    [
                        {
                            "$group": {
                                _id: "$test_date",
                                testresults: {$sum: "$test_result"},
                                count: {$sum: 1}
                            }
                        },
                        {
                            $sort: {
                                '_id': 1
                            }
                        }
                    ],
                    function (err, results) {
                        var statusRes = generateStatResWith10ItemsPerArray(results);
                        resolve(JSON.stringify(statusRes));
                    }
                );
            });
        };
    };

    this.retrieveServAvailByDate = function (date) {
        date = new Date(date);
        var start = moment(date).startOf('day');
        var end = moment(start).add(1, 'days');
        return new Promise(function (resolve, reject) {
            TestResult.find({
                "test_date": {
                    $lt: end,
                    $gt: start
                }
            }, function (err, results) {
                if (err) {
                    reject({validDate: false});
                }
                else {
                    if (results.length !== 0) {
                        var totalRes = results.reduce(function (prev, curr) {
                            return {test_result: prev.test_result + curr.test_result};
                        });
                        var divisor = 3 * results.length;
                        var avail = (totalRes.test_result / divisor) * 100;
                        var unavail = 100 - avail;
                        resolve(JSON.stringify({validDate: true, resultsFound: true, avail: avail, unavail: unavail}));
                    } else {
                        reject({validDate: true, resultsFound: false});
                    }
                }
            });
        });
    };

    this.retrieveFuncNames = function () {
        return new Promise(function(resolve, reject) {
            APIFunction.aggregate(
                [
                    {
                        $sort: {
                            name: 1
                        }
                    },
                    {
                        $project: {
                            "_id": 0,
                            name: 1,
                            services: 1
                        }
                    }
                ], function (err, results) {
                    resolve(JSON.stringify(results));
                }
            );
        });
    }

    this.retrieveFuncServNames = function (functionName) {
        return new Promise(function(resolve, reject) {
            APIFunction.aggregate(
                [
                    {
                        $match: {
                            name: functionName
                        }
                    },
                    {
                        $unwind: "$services"
                    },
                    {
                        $lookup: {
                            from: "apicalls",
                            localField: "services",
                            foreignField: "_id",
                            as: "service"
                        }
                    },
                    {
                        $sort: {
                            services: -1
                        }
                    }
                ], function (err, results) {
                    resultsArr = results.map(function (result) {
                        return {
                            name: result.service[0].name,
                            testUrl: result.service[0].url
                        };
                    });
                    resolve(resultsArr);
                });
        });
    }

//    * Get the data for a particular function.
//* @param res
//    */
    this.retrieveFunctionResults = function (name, res) {
        return new Promise(function(resolve, reject) {
            APIFunction.aggregate([
                {
                    $match: {
                        name: name
                    }
                },
                {
                    $unwind: "$services"
                },
                {
                    $lookup: {
                        from: 'testresults',
                        localField: "services",
                        foreignField: "service_id",
                        as: "data"
                    }
                },
                {
                    $unwind: "$data"
                }, {
                    $group: {
                        _id: "$data.test_date",
                        testresults: {$sum: "$data.test_result"},
                        count: {$sum: 1}
                    }
                },
                {
                    $sort: {
                        '_id': 1
                    }
                }
            ], function (err, results) {
                if (err) return console.error(err);
                else {
                    var statusRes = generateStatResWith10ItemsPerArray(results);
                    resolve(JSON.stringify(statusRes));
                }
            });
        });
    };

    /**
     * Get the data for the service of a particular function
     * @param funcServName
     * @param res
     */
    this.retrieveFuncServData = function (funcServName) {
        return new Promise(function(resolve, reject) {
            TestResult.aggregate(
                [
                    {
                        $match: {
                            service_name: funcServName
                        }
                    },
                    {
                        "$group": {
                            _id: "$test_date",
                            testresults: {$sum: "$test_result"},
                            count: {$sum: 1}
                        }
                    },
                    {
                        $sort: {
                            '_id': 1
                        }
                    }
                ], function (err, results) {
                    if (err) return console.error(err);
                    else {
                        var statusRes = generateStatResWith10ItemsPerArray(results);
                        resolve(JSON.stringify(statusRes));
                    }
                }
            );
        });
    };

    /**
     * Helper method that generates exactly 10 results from an array of result objects.
     * Used for data in the graphs.
     * @param results
     * @returns {{labels: (Array|*), data: (Array|*)}}
     */
    function generateStatResWith10ItemsPerArray(results) {
        var tenIndices = [];
        for (var i = 1; i <= 10; i++) {
            var idx = Math.ceil(results.length / 10 * i - 1);
            tenIndices.push(idx);
        }
        var tenRes = results.filter(function (result) {
            var resultIndex = results.indexOf(result);
            return tenIndices.indexOf(resultIndex) > -1;
        });
        tenRes = tenRes.map(function (result) {
            var finalRes = result.testresults / (3 * result.count);
            result.testresults = finalRes;
            return result;
        });
        var statusRes = {
            "labels": tenRes.map(function (result) {
                return moment(result._id).format('MMMM Do YYYY, h:mm:ss a');
            }),
            "data": tenRes.map(function (result) {
                return result.testresults;
            })
        };
        return statusRes;
    }
}

module.exports = new ChartDbManager();