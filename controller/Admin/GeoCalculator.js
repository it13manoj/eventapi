const { Client } = require("@googlemaps/google-maps-services-js");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const axios = require("axios");
const client = new Client({});

exports.geoDistanceAPI = async (req, res) => {
    try {
        const from = req.query.from || req.params.from;
        const to = req.query.to || req.params.to;

        if (!from || !to || typeof from !== "string" || typeof to !== "string" || !from.trim() || !to.trim()) {
            return res.json({
                status: 400,
                message: "Origins and destinations are required",
                distance: null,
                distance_value: null,
            });
        }

        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/distancematrix/json",
            {
                params: {
                    origins: from.trim(),
                    destinations: to.trim(),
                    key: "AIzaSyADyptfsQzv7jdCZxjQjpJSf7ntcGLareA"
                }
            }
        );

        const element = response.data?.rows?.[0]?.elements?.[0];

        if (!element || element.status !== "OK") {
            return res.json({
                status: 300,
                message: element?.status || "No distance data found",
                distance: null,
                distance_value: null,
                googleResponse: response.data
            });
        }

        return res.json({
            status: 200,
            distance: element.distance?.text,
            distance_value: element.distance?.value, // in meters
            duration: element.duration?.text,
            googleStatus: element.status
        });

    } catch (err) {
        console.error("geoDistanceAPI error:", err.message);

        return res.json({
            status: 500,
            message: err.message,
            distance: null,
            distance_value: null,
        });
    }
};
