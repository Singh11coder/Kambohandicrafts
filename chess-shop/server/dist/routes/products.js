"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const { q, category, magnetic, round, folding, minSize, maxSize, minPrice, maxPrice } = req.query;
    const where = {};
    if (q)
        where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
    if (category)
        where.category = { name: category };
    if (magnetic !== undefined)
        where.isMagnetic = magnetic === 'true';
    if (round !== undefined)
        where.isRound = round === 'true';
    if (folding !== undefined)
        where.isFolding = folding === 'true';
    if (minSize)
        where.sizeInches = { ...(where.sizeInches || {}), gte: Number(minSize) };
    if (maxSize)
        where.sizeInches = { ...(where.sizeInches || {}), lte: Number(maxSize) };
    if (minPrice)
        where.priceCents = { ...(where.priceCents || {}), gte: Number(minPrice) };
    if (maxPrice)
        where.priceCents = { ...(where.priceCents || {}), lte: Number(maxPrice) };
    const products = await prisma.product.findMany({ where, include: { images: true, category: true } });
    res.json(products);
});
router.get('/:id', async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { images: true, category: true } });
    if (!product)
        return res.status(404).json({ error: 'Not found' });
    res.json(product);
});
exports.default = router;
