const Gallery = require("../models/Gallery");
const Notification = require("../models/Notification");

const listGalleries = async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { client: req.user.id };
    const galleries = await Gallery.find(filter).populate("client", "name email").sort({ createdAt: -1 });
    res.json({ success: true, galleries });
};

const createGallery = async (req, res) => {
    const { title, client, published, photos = [] } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Gallery title is required." });
    }

    const targetClient = req.user.role === "admin" ? client || req.user.id : req.user.id;
    const gallery = await Gallery.create({
        title: title.trim(),
        client: targetClient,
        published: Boolean(published),
        photos: Array.isArray(photos) ? photos : [],
    });

    res.status(201).json({ success: true, gallery });
};

const updateGallery = async (req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found." });

    if (req.user.role !== "admin" && gallery.client.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Gallery access denied." });
    }

    const update = { ...req.body };
    if (update.client && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Clients cannot reassign gallery ownership." });
    }

    Object.assign(gallery, update);
    await gallery.save();

    if (req.body.published && gallery.published) {
        await Notification.create({
            recipient: gallery.client,
            type: "GALLERY_PUBLISHED",
            message: `Your gallery "${gallery.title}" is ready.`,
            link: "/dashboard/galleries",
        });
    }

    res.json({ success: true, gallery });
};

const updatePhoto = async (req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found." });

    if (req.user.role !== "admin" && gallery.client.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Gallery access denied." });
    }

    const photo = gallery.photos.id(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found." });

    if (req.body.status) photo.status = req.body.status;
    if (req.body.comment) photo.comments.push({ author: req.user.id, text: req.body.comment });
    await gallery.save();
    res.json({ success: true, gallery });
};

const addPhoto = async (req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found." });

    if (req.user.role !== "admin" && gallery.client.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Gallery access denied." });
    }

    const photos = Array.isArray(req.body) ? req.body : [req.body];
    gallery.photos.push(...photos);
    await gallery.save();
    res.json({ success: true, gallery });
};

module.exports = { listGalleries, createGallery, updateGallery, updatePhoto, addPhoto };
