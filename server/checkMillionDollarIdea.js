const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;


    if(!numWeeks || !weeklyRevenue) {
        return res.status(400).send("Missing inputs!");
    } 

    if(isNaN(parseInt(numWeeks)) || isNaN(parseInt(weeklyRevenue)) ) {
        return res.status(400).send("Inputs must be a number!");
    } 

    const totalYield = numWeeks * weeklyRevenue;
    if(totalYield < 1000000) {
        return res.status(400).send("No a million dollar idea!");
    }  else {
        next();
    }

};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
