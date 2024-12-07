import React, { useState, useCallback, useEffect } from 'react';
import './ProductList.css';
import { useTelegram } from "../../hooks/useTelegram";

     import pizza from '../images/pizza.jpg';
     import caesar from '../images/caesar.jpg';
     import shawarma from '../images/shawarma.jpg';
     import water from '../images/water.jpg';
     import soda from '../images/soda.jpg';
     import cola from '../images/cola.jpg';

const products = [
    { id: '1', title: 'Пицца', price: 90, description: '', image: 'pizza.jpg' },
    { id: '2', title: 'Цезарь', price: 150, description: '', image: 'caesar.jpg' },
    { id: '3', title: 'Шаурма', price: 120, description: '', image: 'shawarma.jpg' },
    { id: '4', title: 'Минеральная вода', price: 50, description: '', image: 'water.jpg' },
    { id: '5', title: 'Лимонад', price: 60, description: '', image: 'soda.jpg' },
    { id: '6', title: 'Кока-Кола', price: 70, description: '', image: 'cola.jpg' }
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + item.price, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        };
        fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }, [addedItems, queryId]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)} руб.`
            });
        }
    };

    return (
        <div className="list">
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    className="item"
                />
            ))}
        </div>
    );
};

const ProductItem = ({ product, onAdd }) => {
    return (
        <div className="item">
            <img src={`/static/images/${product.image}`} alt={product.title} />
            <div>
                <h3>{product.title}</h3>
                <p>Цена: {product.price} руб.</p>
                <button onClick={() => onAdd(product)}>Добавить в корзину</button>
            </div>
        </div>
    );
};

export default ProductList;
