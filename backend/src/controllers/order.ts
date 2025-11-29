import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import validator from 'validator';
import Product from '../models/product';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment,
      email,
      phone,
      address,
      total,
      items,
    } = req.body;

    if (payment !== 'card' && payment !== 'online') {
      return res.status(400).json({ message: 'Invalid payment type' });
    }

    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ message: 'Invalid phone' });
    }

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ message: 'Invalid address' });
    }

    if (typeof total !== 'number' || Number.isNaN(total)) {
      return res.status(400).json({ message: 'Invalid total' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array' });
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: 'One or more products not found' });
    }

    const productWithoutPrice = products.find((product) => product.price === null);

    if (productWithoutPrice) {
      return res.status(400).json({ message: 'One or more products have no price' });
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price as number), 0);

    if (calculatedTotal !== total) {
      return res.status(400).json({ message: 'Total does not match sum of product prices' });
    }

    const id = faker.string.uuid();

    return res.status(201).json({ id, total });
  } catch (err) {
    return next(err);
  }
};
