const Service = require("../models/Service");
const Package = require("../models/Package");

const listServices = async (req, res) => res.json({ success: true, services: await Service.find({ active: true }).sort({ name: 1 }) });
const listPackages = async (req, res) => res.json({ success: true, packages: await Package.find({ active: true }).populate("service", "name slug").sort({ createdAt: -1 }) });
const createService = async (req, res) => res.status(201).json({ success: true, service: await Service.create(req.body) });
const updateService = async (req, res) => res.json({ success: true, service: await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) });
const createPackage = async (req, res) => res.status(201).json({ success: true, package: await Package.create(req.body) });
const updatePackage = async (req, res) => res.json({ success: true, package: await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("service", "name slug") });

module.exports = { listServices, listPackages, createService, updateService, createPackage, updatePackage };
