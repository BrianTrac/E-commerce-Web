import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';


const PayPalPayment = ({ cartItems, totalPrice, onSuccess, onError, orderId }) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const createOrder = async () => {
    try {
      const response = await axiosPrivate.post('/api/payment/paypal/create-order', {
        cartItems,
        totalPrice,
      });
      
      const order = response.data;
      return order.orderId;
    } catch (err) {
      console.error('Error creating PayPal order:', err);
      onError(err);
    }
  };

  const onApprove = async (data) => {
    try {   
        const response = await axiosPrivate.post('/api/payment/paypal/capture-order', {
            orderId: data.orderID,
        });
        
        const orderData = response.data;
        
        if (orderData.status === 'COMPLETED') {
            onSuccess(orderData);
            navigate(`/checkout/success?orderId=${orderId}`);
        }
    } catch (err) {
        console.error('Error capturing PayPal order:', err);
        onError(err);
    }
};

  return (
    <div className="w-full">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
        style={{
          layout: 'horizontal',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        }}
      />
    </div>
  );
};

const PayPalWrapper = ({ cartItems, totalPrice, onSuccess, onError, orderId }) => {
    const rate = 23000;

    // convert totalPrice to USD
    const totalPriceUSD = (totalPrice / rate).toFixed(2);

    // convert each item price to USD and price to 2 decimal places
    const cartItemsUSD = cartItems.map((item) => {
        const price = parseFloat(item.product.price);
        const quantity = parseInt(item.quantity, 10);
        return {
            ...item,
            product: {
                ...item.product,
                price: (price / rate).toFixed(2),
            },
            quantity,
        };
    });

    return (
    <PayPalScriptProvider options={{
      clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
      currency: 'USD'
    }}>
      <PayPalPayment 
        cartItems={cartItemsUSD}
        totalPrice={totalPriceUSD}
        onSuccess={onSuccess}
        onError={onError}
        orderId={orderId}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalWrapper;
