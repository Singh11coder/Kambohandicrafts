"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
function signToken(payload) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '7d' });
}
function requireAdmin(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'dev-secret');
        if (!decoded.isAdmin)
            return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name)
        return res.status(400).json({ error: 'Missing fields' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: 'Email already used' });
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name, isAdmin: false } });
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
        return res.status(400).json({ error: 'Missing fields' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
});
exports.default = router;
