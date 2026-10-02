const { Client } = require("@googlemaps/google-maps-services-js");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const axios = require("axios");
const client = new Client({});

exports.geoDistanceAPI = async (req, res) => {
    try {
        const { from, to } = req.params;

        console.log("From:",  req.params);
        console.log("To:", to);

        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/distancematrix/json",
            {
                params: {
                    origins: from,
                    destinations: to,
                    key: "AIzaSyADyptfsQzv7jdCZxjQjpJSf7ntcGLareA"
                }
            }
        );

        console.log("Google Response:", response.data);

        const element = response.data?.rows?.[0]?.elements?.[0];

        if (!element) {
            return res.json({
                status: 300,
                message: "No distance data found",
                googleResponse: response.data
            });
        }

        return res.json({
            status: 200,
            distance: element.distance?.text,
            duration: element.duration?.text,
            googleStatus: element.status
        });

    } catch (err) {
        console.error(err);

        return res.json({
            status: 300,
            message: err.message
        });
    }
};
