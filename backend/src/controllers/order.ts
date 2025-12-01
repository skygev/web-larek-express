import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import validator from 'validator';
import Product from '../models/product';
import { BadRequestError } from '../errors';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new BadRequestError('Некорректный способ оплаты'));
    }

    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
      return next(new BadRequestError('Некорректный email'));
    }

    if (!phone || typeof phone !== 'string') {
      return next(new BadRequestError('Некорректный телефон'));
    }

    if (!address || typeof address !== 'string') {
      return next(new BadRequestError('Некорректный адрес'));
    }

    if (typeof total !== 'number' || Number.isNaN(total)) {
      return next(new BadRequestError('Некорректная сумма заказа'));
    }

    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Список товаров не может быть пустым'));
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    const productWithoutPrice = products.find((product) => product.price === null);

    if (productWithoutPrice) {
      return next(new BadRequestError('Один или несколько товаров не имеют цены'));
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price as number), 0);

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Сумма заказа не совпадает с суммой товаров'));
    }

    const id = faker.string.uuid();

    return res.status(200).json({ id, total });
  } catch (err) {
    return next(err);
  }
};

export default createOrder;
