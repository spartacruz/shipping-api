const ShippingRate = require('../models/ShippingRate');
const Shipment = require('../models/Shipment');
const Config = require('../models/Config');

exports.getShippingRates = (req, res) => {
    const { origin, destination, weight } = req.query;

    if (!origin || !destination || !weight) {
        return res.status(400).json({ status: "error", message: "Missing required parameters: origin, destination, and weight are required." });
    }

    if (!/^\d+(\.\d{1,2})?$/.test(weight)) {
        return res.status(400).json({ status: "error", message: "Invalid weight format. Use a dot for decimals, and ensure no more than two decimal places." });
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
                    calculatedRate: Math.floor(weightNum * rate.rate),
                    estimated_delivery: rate.estimated_delivery
                }));

                res.json({ status: "success", rates: adjustedRates });
            });
        });
    });
};

exports.createShipment = (req, res) => {
    const { origin, destination, weight, service } = req.body;
    const { name: recipientName, phone: recipientPhone, email: recipientEmail } = req.body.recipient || {};
    const userId = req.user.id;

    // Validate recipient information
    if (!recipientName || !recipientPhone || !recipientEmail) {
        return res.status(400).json({ status: "error", message: "Recipient name, phone, and email are required." });
    }

    // Validate that the specified origin, destination, and service exist in ShippingRates
    ShippingRate.findRate(origin, destination, service, (err, rate) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }

        if (!rate) {
            return res.status(400).json({ status: "error", message: "Invalid origin, destination, or service. Please select a valid shipping option." });
        }

        // Calculate the total cost
        const calculatedRate = Math.floor(weight * rate.rate);

        // Generate tracking number based on date and running number
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0].replace(/-/g, ''); // Format as YYYYMMDD

        // Fetch the current count of shipments with today's date in the tracking number
        Shipment.getDailyCount(todayDate, (err, count) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Error generating tracking number" });
            }

            const runningNumber = String(count + 1).padStart(4, '0'); // Ensure a 4-digit running number
            const trackingNumber = `AWB${todayDate}${runningNumber}`;

            // Create the shipment record
            Shipment.create(
                userId,
                origin,
                destination,
                weight,
                service,
                recipientName,
                recipientPhone,
                recipientEmail,
                trackingNumber,
                calculatedRate,
                (err, newShipment) => {
                    if (err) {
                        return res.status(500).json({ status: "error", message: "Error creating shipment" });
                    }
                    res.status(201).json({
                        status: "success",
                        message: "Shipment created successfully.",
                        shipmentId: newShipment.id,
                        trackingNumber
                    });
                }
            );
        });
    });
};