const Gallery = require("../models/Gallery");
const Notification = require("../models/Notification");

const listGalleries = async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { client: req.user.id, published: true };
    res.json({ success: true, galleries: await Gallery.find(filter).populate("client", "name email").sort({ createdAt: -1 }) });
};
const createGallery = async (req, res) => res.status(201).json({ success: true, gallery: await Gallery.create(req.body) });
const updateGallery = async (req, res) => {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found." });
    if (req.body.published) await Notification.create({ recipient: gallery.client, type: "GALLERY_PUBLISHED", message: `Your gallery "${gallery.title}" is ready.`, link: "/dashboard/galleries" });
    res.json({ success: true, gallery });
};
const updatePhoto = async (req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found." });
    const photo = gallery.photos.id(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found." });
    if (req.user.role !== "admin" && gallery.client.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Gallery access denied." });
    if (req.body.status) photo.status = req.body.status;
    if (req.body.comment) photo.comments.push({ author: req.user.id, text: req.body.comment });
    await gallery.save();
    res.json({ success: true, gallery });
};
const addPhoto = async (req, res) => {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, { $push: { photos: req.body } }, { new: true, runValidators: true });
    res.json({ success: true, gallery });
};
module.exports = { listGalleries, createGallery, updateGallery, updatePhoto, addPhoto };
