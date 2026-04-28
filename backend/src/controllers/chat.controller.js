import ChatSession from '../models/chatSession.model.js';
import Item from '../models/item.model.js';

// ── Simple intent detector ────────────────────────────────
const detectIntent = (text) => {
    const t = text.toLowerCase();
    if (t.includes('lost') || t.includes('missing')) return 'report_lost';
    if (t.includes('found') || t.includes('i found')) return 'report_found';
    if (t.includes('claim') || t.includes('mine') || t.includes('belong')) return 'claim_item';
    if (t.includes('search') || t.includes('looking for') || t.includes('find')) return 'search_item';
    if (t.includes('hello') || t.includes('hi') || t.includes('help')) return 'greeting';
    return 'faq';
};

// ── Bot reply generator ───────────────────────────────────
const getBotReply = async (intent, content, session) => {
    switch (intent) {
        case 'greeting':
            return {
                content: "Hi! 👋 I'm the Campus Lost & Found assistant. I can help you report a lost/found item, search for items, or guide you through claiming one. What do you need?",
                suggested_items: [],
            };

        case 'report_lost':
            return {
                content: "I'll help you report a lost item. Please go to the Report page and fill in the details — title, category, last seen location, and a description. Do you want me to search if someone already found it?",
                suggested_items: [],
            };

        case 'report_found':
            return {
                content: "Great that you found something! Please report it via the Report page so the owner can find it. Include photos if you can.",
                suggested_items: [],
            };

        case 'search_item': {
            // Extract keywords from message for search
            const keywords = content.replace(/search|looking for|find|i lost|my/gi, '').trim();
            const items = await Item.find(
                { $text: { $search: keywords }, status: 'open' },
                { score: { $meta: 'textScore' } }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(5)
                .select('title category location image_urls type date_occurred');

            if (items.length === 0) {
                return {
                    content: `I searched for "${keywords}" but found no matching items. Would you like to report it as lost?`,
                    suggested_items: [],
                };
            }

            return {
                content: `I found ${items.length} possible match(es) for "${keywords}". Take a look below:`,
                suggested_items: items.map((i) => i._id),
            };
        }

        case 'claim_item':
            return {
                content: "To claim a found item, open the item page and click 'Submit Claim'. You'll need to describe how you can prove ownership. An admin will review your claim.",
                suggested_items: [],
            };

        default:
            return {
                content: "I'm not sure I understood that. I can help you: 🔍 Search for items | 📋 Report lost/found | 📦 Claim an item. Which do you need?",
                suggested_items: [],
            };
    }
};

// @desc    Start a new chat session
// @route   POST /api/chat/session
// @access  Private
export const startSession = async (req, res, next) => {
    try {
        const session = await ChatSession.create({
            user_id: req.user.id,
            messages: [{
                sender: 'bot',
                content: "Hi! 👋 I'm here to help you with Campus Lost & Found. How can I assist you today?",
                intent: 'greeting',
                sent_at: new Date(),
            }],
        });

        res.status(201).json({ success: true, session });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my chat sessions
// @route   GET /api/chat/sessions
// @access  Private
export const getMySessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.find({ user_id: req.user.id })
            .select('status createdAt messages')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: sessions.length, sessions });
    } catch (err) {
        next(err);
    }
};

// @desc    Get a single session with all messages
// @route   GET /api/chat/session/:id
// @access  Private
export const getSessionById = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        if (session.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        res.status(200).json({ success: true, session });
    } catch (err) {
        next(err);
    }
};

// @desc    Send a message — bot detects intent and replies
// @route   POST /api/chat/session/:id/message
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const { content } = req.body;
        const session = await ChatSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        if (session.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        if (session.status === 'closed') {
            return res.status(400).json({ success: false, message: 'This session is closed.' });
        }

        // 1. Detect intent
        const intent = detectIntent(content);

        // 2. Add user message
        const userMsg = { sender: 'user', content, intent, sent_at: new Date() };
        session.messages.push(userMsg);

        // 3. Generate bot reply
        const botReply = await getBotReply(intent, content, session);
        const botMsg = {
            sender: 'bot',
            content: botReply.content,
            intent,
            suggested_items: botReply.suggested_items,
            sent_at: new Date(),
        };
        session.messages.push(botMsg);

        await session.save();

        res.status(200).json({
            success: true,
            userMessage: userMsg,
            botMessage: botMsg,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Close a chat session
// @route   PATCH /api/chat/session/:id/close
// @access  Private
export const closeSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        if (session.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        session.status = 'closed';
        await session.save();

        res.status(200).json({ success: true, message: 'Chat session closed.' });
    } catch (err) {
        next(err);
    }
};