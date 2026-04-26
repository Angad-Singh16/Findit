import Claim from '../models/claim.model.js';
import Item from '../models/item.model.js';
import Notification from '../models/notification.model.js';

// @desc    Submit a claim
// @route   POST /api/claims
// @access  Private
export const submitClaim = async (req, res, next) => {
    try {
        const { item_id, proof_description } = req.body;

        const item = await Item.findById(item_id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (item.type !== 'found') {
            return res.status(400).json({
                success: false,
                message: 'You can only claim a found item.',
            });
        }

        if (item.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This item is no longer available for claiming.',
            });
        }

        // Check if user already claimed this item
        const existing = await Claim.findOne({ item_id, user_id: req.user.id });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You already have a claim on this item.',
            });
        }

        const proof_images = req.files
            ? req.files.map((f) => `/uploads/${f.filename}`)
            : [];

        const claim = await Claim.create({
            item_id,
            user_id: req.user.id,
            proof_description,
            proof_images,
        });

        // Notify item reporter
        await Notification.create({
            user_id: item.user_id,
            item_id: item._id,
            type: 'claim_submitted',
            message: `Someone submitted a claim on your item: "${item.title}"`,
            action_url: `/items/${item._id}`,
        });

        const io = req.app.get('io');
        if (io) io.to(item.user_id.toString()).emit('notification', { type: 'claim_submitted' });

        res.status(201).json({ success: true, claim });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my claims
// @route   GET /api/claims/my
// @access  Private
export const getMyClaims = async (req, res, next) => {
    try {
        const claims = await Claim.find({ user_id: req.user.id })
            .populate('item_id', 'title type status image_urls')
            .sort('-createdAt');
        res.status(200).json({ success: true, count: claims.length, claims });
    } catch (err) {
        next(err);
    }
};

// @desc    Get claims for a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private
export const getClaimsForItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        // Only item owner or admin
        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const claims = await Claim.find({ item_id: req.params.itemId })
            .populate('user_id', 'name email phone')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: claims.length, claims });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all claims (admin)
// @route   GET /api/claims
// @access  Private/Admin
export const getAllClaims = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = status ? { status } : {};
        const skip = (page - 1) * limit;

        const [claims, total] = await Promise.all([
            Claim.find(filter)
                .populate('item_id', 'title type')
                .populate('user_id', 'name email')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Claim.countDocuments(filter),
        ]);

        res.status(200).json({ success: true, total, page: Number(page), claims });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve or reject a claim (admin)
// @route   PATCH /api/claims/:id/status
// @access  Private/Admin
export const updateClaimStatus = async (req, res, next) => {
    try {
        const { status, rejection_reason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
        }

        const claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ success: false, message: 'Claim not found.' });
        }

        claim.status = status;
        claim.reviewed_by = req.user.id;
        claim.reviewed_at = new Date();
        if (rejection_reason) claim.rejection_reason = rejection_reason;
        await claim.save();

        if (status === 'approved') {
            // Update item status
            await Item.findByIdAndUpdate(claim.item_id, { status: 'claimed' });

            // Reject all other pending claims on same item
            await Claim.updateMany(
                { item_id: claim.item_id, _id: { $ne: claim._id }, status: 'pending' },
                { status: 'rejected', rejection_reason: 'Another claim was approved.' }
            );
        }

        // Notify claimant
        const notifMsg = status === 'approved'
            ? 'Your claim has been approved! Please collect your item.'
            : `Your claim was rejected. Reason: ${rejection_reason || 'N/A'}`;

        await Notification.create({
            user_id: claim.user_id,
            item_id: claim.item_id,
            type: status === 'approved' ? 'claim_approved' : 'claim_rejected',
            message: notifMsg,
        });

        const io = req.app.get('io');
        if (io) io.to(claim.user_id.toString()).emit('notification', { type: `claim_${status}` });

        res.status(200).json({ success: true, claim });
    } catch (err) {
        next(err);
    }
};

// @desc    Withdraw a pending claim
// @route   DELETE /api/claims/:id
// @access  Private
export const withdrawClaim = async (req, res, next) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ success: false, message: 'Claim not found.' });
        }

        if (claim.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        if (claim.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending claims can be withdrawn.' });
        }

        await claim.deleteOne();
        res.status(200).json({ success: true, message: 'Claim withdrawn.' });
    } catch (err) {
        next(err);
    }
};