"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
// Categories
router.get('/categories', async (_req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});
router.post('/categories', async (req, res) => {
    const { name } = req.body || {};
    if (!name)
        return res.status(400).json({ error: 'Name required' });
    const category = await prisma.category.create({ data: { name } });
    res.json(category);
});
router.put('/categories/:id', async (req, res) => {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: { name: req.body?.name } });
    res.json(category);
});
router.delete('/categories/:id', async (req, res) => {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
});
// Products
router.get('/products', async (_req, res) => {
    const products = await prisma.product.findMany({ include: { images: true, category: true } });
    res.json(products);
});
router.post('/products', async (req, res) => {
    const { name, description, priceCents, stock, isMagnetic, isRound, isFolding, sizeInches, categoryId, images } = req.body || {};
    const product = await prisma.product.create({
        data: {
            name,
            description,
            priceCents,
            stock,
            isMagnetic: !!isMagnetic,
            isRound: !!isRound,
            isFolding: !!isFolding,
            sizeInches,
            categoryId,
            images: images?.length ? { create: images.map((url) => ({ url })) } : undefined,
        },
        include: { images: true },
    });
    res.json(product);
});
router.put('/products/:id', async (req, res) => {
    const { name, description, priceCents, stock, isMagnetic, isRound, isFolding, sizeInches, categoryId, images } = req.body || {};
    const product = await prisma.product.update({
        where: { id: req.params.id },
        data: {
            name,
            description,
            priceCents,
            stock,
            isMagnetic,
            isRound,
            isFolding,
            sizeInches,
            categoryId,
            images: images ? {
                deleteMany: {},
                create: images.map((url) => ({ url }))
            } : undefined
        },
        include: { images: true },
    });
    res.json(product);
});
router.delete('/products/:id', async (req, res) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
});
exports.default = router;
