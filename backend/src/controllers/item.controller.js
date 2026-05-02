import Item from '../models/item.model.js';

// @desc    Get all items with filters & pagination
// @route   GET /api/items?type=lost&category=Electronics&page=1&limit=10
// @access  Public
export const getAllItems = async (req, res, next) => {
    try {
        const { type, category, location, status = 'open', page = 1, limit = 10 } = req.query;

        const filter = { status };
        if (type) filter.type = type;
        if (category) filter['category.name'] = new RegExp(category, 'i');
        if (location) filter['location.name'] = new RegExp(location, 'i');

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Item.find(filter)
                .populate('user_id', 'name email phone')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Item.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new item report
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res, next) => {
    try {
        const {
            title, description, type, status,
            category, location, tags, date_occurred,
        } = req.body;

        // Handle uploaded images
        const image_urls = req.files
  ?     req.files.map((f) => f.path)  // f.path is full Cloudinary URL
        : [];

        const item = await Item.create({
            user_id: req.user.id,
            title,
            description,
            type,
            status,
            category: typeof category === 'string' ? JSON.parse(category) : category,
            location: typeof location === 'string' ? JSON.parse(location) : location,
            image_urls,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
            date_occurred,
        });

        // Emit socket notification to all admins (optional)
        const io = req.app.get('io');
        if (io) {
            io.emit('new_item', {
                type: item.type,
                title: item.title,
                id: item._id,
            });
        }

        res.status(201).json({ success: true, item });
    } catch (err) {
        next(err);
    }
};

// @desc    Get items reported by logged-in user
// @route   GET /api/items/my
// @access  Private
export const getMyItems = async (req, res, next) => {
    try {
        const items = await Item.find({ user_id: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: items.length, items });
    } catch (err) {
        next(err);
    }
};

// @desc    Full-text search across title, description, tags
// @route   GET /api/items/search?q=blue+wallet&type=lost
// @access  Public
export const searchItems = async (req, res, next) => {
    try {
        const { q, type, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query q is required.',
            });
        }

        const filter = {
            $text: { $search: q },
            ...(type && { type }),
        };

        const skip = (page - 1) * limit;

        const items = await Item.find(filter, { score: { $meta: 'textScore' } })
            .populate('user_id', 'name email')
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({ success: true, count: items.length, items });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('user_id', 'name email phone');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found.',
            });
        }

        res.status(200).json({ success: true, item });
    } catch (err) {
        next(err);
    }
};

// @desc    Update item (owner or admin)
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res, next) => {
    try {
        let item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        // Authorization check
        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item.',
            });
        }

        const { title, description, category, location, tags, date_occurred } = req.body;

        const updates = { title, description, date_occurred };
        if (category) updates.category = typeof category === 'string' ? JSON.parse(category) : category;
        if (location) updates.location = typeof location === 'string' ? JSON.parse(location) : location;
        if (tags) updates.tags = Array.isArray(tags) ? tags : tags.split(',');

        // Add new images if uploaded
        if (req.files && req.files.length > 0) {
            updates.image_urls = [
                ...item.image_urls,
                ...req.files.map((f) => f.path),
            ];
        }

        item = await Item.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, item });
    } catch (err) {
        next(err);
    }
};

// @desc    Update item status
// @route   PATCH /api/items/:id/status
// @access  Private
export const updateItemStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['open', 'claimed', 'resolved', 'expired'];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${allowed.join(', ')}`,
            });
        }

        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        item.status = status;
        await item.save();

        res.status(200).json({ success: true, item });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete item (owner or admin)
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        await item.deleteOne();

        res.status(200).json({ success: true, message: 'Item deleted successfully.' });
    } catch (err) {
        next(err);
    }
};