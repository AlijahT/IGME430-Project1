const fs = require('fs');

const blasters = JSON.parse(fs.readFileSync(`${__dirname}/../blasters.json`));

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

// JSON response for getting builds
const getBuild = (request, response) => {
    const responseJSON = {
        blasters,
    };

    respondJSON(request, response, 200, responseJSON);
};



// POST request
const addBuild = (request, response, body) => {
    // default message
    const responseJSON = {
        message: 'Please Fill all options',
    };

    // checks to see if all fields are filled in.
    // returns with 400 error code if both are empty
    if (!body.name || !body.blaster || !body.barrel || !body.spring 
    || !body.additional || !body.fps || !body.price) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    // default status code
    let responseCode = 204;

    // if the user does not exist set code 201 and create an empty user
    if (!blasters.builds[body.name]) {
        responseCode = 201;
        blasters.builds[body.name] = {};
    }

    // add fields for the build
    blasters.builds[body.name].name = body.name;
    blasters.builds[body.name].blaster = body.blaster;
    blasters.builds[body.name].spring = body.spring;
    blasters.builds[body.name].additional = body.additional;
    blasters.builds[body.name].fps = body.fps;
    blasters.builds[body.name].price = body.price;

    // if 201 status code, use this message response
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

// runs if the page could not be found
const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for could not be located.',
        id: 'not found',
    };

    respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getBuild,
    addBuild,
    notReal,
};