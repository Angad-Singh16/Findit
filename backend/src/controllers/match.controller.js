import Item from '../models/item.model.js';
import Match from '../models/match.model.js';
import Notification from '../models/notification.model.js';

// @desc    Get matches for a specific item
// @route   GET /api/matches/item/:itemId
// @access  Private
export const getMatchesForItem = async (req, res, next) => {
    try {
        const matches = await Match.find({
            $or: [
                { lost_item_id: req.params.itemId },
                { found_item_id: req.params.itemId },
            ],
        })
            .populate('lost_item_id', 'title category location image_urls')
            .populate('found_item_id', 'title category location image_urls')
            .sort('-confidence');

        res.status(200).json({ success: true, count: matches.length, matches });
    } catch (err) {
        next(err);
    }
};

// @desc    Get matches related to logged-in user's items
// @route   GET /api/matches/my
// @access  Private
export const getMyMatches = async (req, res, next) => {
    try {
        // Get all items belonging to user
        const userItems = await Item.find({ user_id: req.user.id }).select('_id');
        const itemIds = userItems.map((i) => i._id);

        const matches = await Match.find({
            $or: [
                { lost_item_id: { $in: itemIds } },
                { found_item_id: { $in: itemIds } },
            ],
        })
            .populate('lost_item_id', 'title type category location image_urls')
            .populate('found_item_id', 'title type category location image_urls')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: matches.length, matches });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a match (admin / system)
// @route   POST /api/matches
// @access  Private/Admin
export const createMatch = async (req, res, next) => {
    try {
        const { lost_item_id, found_item_id, confidence, match_reason } = req.body;

        // Validate both items exist
        const [lostItem, foundItem] = await Promise.all([
            Item.findById(lost_item_id),
            Item.findById(found_item_id),
        ]);

        if (!lostItem || !foundItem) {
            return res.status(404).json({ success: false, message: 'One or both items not found.' });
        }

        const match = await Match.create({
            lost_item_id, found_item_id, confidence, match_reason,
        });

        // Notify both item owners
        const notifications = [
            {
                user_id: lostItem.user_id,
                item_id: lostItem._id,
                type: 'match_found',
                message: `A potential match was found for your lost item: "${lostItem.title}"`,
                action_url: `/matches/${match._id}`,
            },
            {
                user_id: foundItem.user_id,
                item_id: foundItem._id,
                type: 'match_found',
                message: `Your found item "${foundItem.title}" may belong to someone!`,
                action_url: `/matches/${match._id}`,
            },
        ];

        await Notification.insertMany(notifications);

        const io = req.app.get('io');
        if (io) {
            io.to(lostItem.user_id.toString()).emit('notification', { type: 'match_found' });
            io.to(foundItem.user_id.toString()).emit('notification', { type: 'match_found' });
        }

        res.status(201).json({ success: true, match });
    } catch (err) {
        next(err);
    }
};

// @desc    Confirm or dismiss a match
// @route   PATCH /api/matches/:id
// @access  Private
export const updateMatchStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['confirmed', 'dismissed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be confirmed or dismissed.' });
        }

        const match = await Match.findById(req.params.id)
            .populate('lost_item_id', 'user_id')
            .populate('found_item_id', 'user_id');

        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found.' });
        }

        // Only owners of either item can confirm/dismiss
        const ownerIds = [
            match.lost_item_id.user_id.toString(),
            match.found_item_id.user_id.toString(),
        ];

        if (!ownerIds.includes(req.user.id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        match.status = status;
        match.confirmed_by = req.user.id;
        await match.save();

        res.status(200).json({ success: true, match });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all matches (admin)
// @route   GET /api/matches
// @access  Private/Admin
export const getAllMatches = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = status ? { status } : {};
        const skip = (page - 1) * limit;

        const [matches, total] = await Promise.all([
            Match.find(filter)
                .populate('lost_item_id', 'title category')
                .populate('found_item_id', 'title category')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Match.countDocuments(filter),
        ]);

        res.status(200).json({ success: true, total, page: Number(page), matches });
    } catch (err) {
        next(err);
    }
};