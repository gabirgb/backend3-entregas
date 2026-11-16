import { OrderModel } from '../models/order.model.js';

export const getOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find().populate('client').populate('products.product');
        res.status(200).json({ status: 'success', payload: orders });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findById(id).populate('client').populate('products.product');

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: order });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const { client, products, shippingAddress } = req.body;

        // Validación básica o cálculo de precio total si aplica
        let totalPrice = 0;
        // (Opcional: puedes calcular el total recorriendo los productos o recibirlo)

        const newOrder = await OrderModel.create({
            client,
            products,
            totalPrice: totalPrice || 1500, // Ajusta según tu lógica
            shippingAddress
        });

        res.status(201).json({ status: 'success', payload: newOrder });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validar estados permitidos (ejemplo)
        const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Estado de pedido inválido' });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: updatedOrder });
    } catch (error) {
        next(error);
    }
};