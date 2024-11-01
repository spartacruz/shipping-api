const ShippingRate = require('../models/ShippingRate');
const Shipment = require('../models/Shipment');
const Config = require('../models/Config');

exports.getShippingRates = (req, res) => {
    const { origin, destination, weight } = req.query;

    if (!origin || !destination || !weight) {
        return res.status(400).json({ status: "error", message: "Missing required parameters: origin, destination, and weight are required." });
    }

    const weightNum = parseFloat(weight);

    // Fetch min and max weight configurations
    Config.get('minWeight', (err, minWeight) => {
        if (err) return res.status(500).json({ status: "error", message: "Error retrieving configuration" });

        Config.get('maxWeight', (err, maxWeight) => {
            if (err) return res.status(500).json({ status: "error", message: "Error retrieving configuration" });

            // Validate weight within configured limits
            if (weightNum < minWeight || weightNum > maxWeight) {
                return res.status(400).json({
                    status: "error",
                    message: `Weight must be between ${minWeight}kg and ${maxWeight}kg.`
                });
            }

            // Fetch available shipping rates based on origin and destination
            ShippingRate.findRates(origin, destination, (err, rates) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Internal server error" });
                }

                if (rates.length === 0) {
                    return res.status(404).json({ status: "error", message: "No shipping rates found for the specified route." });
                }

                // Calculate calculatedRate for each rate
                const adjustedRates = rates.map(rate => ({
                    id: rate.id,
                    origin: rate.origin,
                    destination: rate.destination,
                    service: rate.service,
                    rate: rate.rate,
                    calculatedRate: weightNum * rate.rate,  // Calculate based on weight
                    estimated_delivery: rate.service === 'instant' ? '1-2 hours' :
                        rate.service === 'express' ? '1-2 business days' : '3-5 business days'
                }));

                res.json({ status: "success", rates: adjustedRates });
            });
        });
    });
};

exports.createShipment = (req, res) => {
    const { origin, destination, weight, service, recipientName, recipientPhone, recipientEmail } = req.body;
    const trackingNumber = `TRACK${Math.floor(Math.random() * 1000000)}`;
    const userId = req.user.id;

    Shipment.create(userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber, (err, shipment) => {
        if (err) return res.status(500).json({ status: "error", message: "Internal server error" });
        res.status(201).json({ status: "success", shipmentId: shipment.id, trackingNumber });
    });
};
