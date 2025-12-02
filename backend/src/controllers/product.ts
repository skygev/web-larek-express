import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json({
      total: products.length,
      items: products,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      image,
      category,
      description,
      price,
    } = req.body;

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};
