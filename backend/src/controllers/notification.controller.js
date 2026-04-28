import Notification from '../models/notification.model.js';

// @desc    Get my notifications
// @route   GET /api/notifications?is_read=false&page=1&limit=20
// @access  Private
export const getMyNotifications = async (req, res, next) => {
    try {
        const { is_read, page = 1, limit = 20 } = req.query;

        const filter = { user_id: req.user.id };
        if (is_read !== undefined) filter.is_read = is_read === 'true';

        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .populate('item_id', 'title type')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Notification.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            notifications,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            user_id: req.user.id,
            is_read: false,
        });

        res.status(200).json({ success: true, count });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const notif = await Notification.findById(req.params.id);

        if (!notif) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        if (notif.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        notif.is_read = true;
        notif.read_at = new Date();
        await notif.save();

        res.status(200).json({ success: true, notification: notif });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user_id: req.user.id, is_read: false },
            { is_read: true, read_at: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read.',
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
    try {
        const notif = await Notification.findById(req.params.id);

        if (!notif) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        if (notif.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        await notif.deleteOne();

        res.status(200).json({ success: true, message: 'Notification deleted.' });
    } catch (err) {
        next(err);
    }
};