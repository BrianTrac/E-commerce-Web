import React, { useState, useEffect } from 'react';
import { CreditCard, Package, Truck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import generateDeliveryDateTime from '../../utils/generateDeliveryDateTime';
import { handleCheckout, createPaymentUrl } from '../../redux/services/user/paymentService';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import PayPalWrapper from '../../components/user/PayPalWrapper';
import { createOrder, updateOrder } from '../../redux/services/user/orderService';
import { selectUser } from '../../redux/reducers/user/authReducer';
import { deleteCartItem } from '../../redux/services/user/cartService';
import { useSelector } from 'react-redux';
import { getUserByEmail } from '../../redux/services/user/userService';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const { state } = useLocation();
  const { cartItems } = state || {};
  const axiosPrivate = useAxiosPrivate();
  const [showPayPal, setShowPayPal] = useState(false);
  const user = useSelector(selectUser);
  const [orderIdGlobal, setOrderIdGlobal] = useState(null);
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // useEffect
  useEffect(() => {
    debugger;
    if (!cartItems || cartItems.length === 0) {
      navigate('/checkout/cart');
      return;
    }

    const calculatedOrderDetails = cartItems.reduce(
      (acc, item) => {
        const price = item.product.price * item.quantity; // Discounted price of the item
        const originalPrice = item.product.original_price * item.quantity; // Original price of the item
        const discount = originalPrice - price; // Discount applied to the item
    
        // Update accumulators
        acc.total += price; // Total (after discounts)
        acc.subtotal += originalPrice; // Subtotal (before discounts)
        acc.totalSavings += discount; // Total savings from discounts
        acc.shipping += 10000; // Fixed shipping cost per item (can adjust logic if needed)
        acc.sellerDiscount += 0; // Add seller-specific discounts here if applicable
        acc.shippingDiscount += 5000; // Fixed shipping discount per item
    
        return acc;
      },
      {
        total: 0, subtotal: 0, totalSavings: 0, discount: 0, shipping: 0, sellerDiscount: 0, shippingDiscount: 0,
      }
    );

    // Final adjustment to calculate combined discount
    calculatedOrderDetails.discount = calculatedOrderDetails.subtotal - calculatedOrderDetails.total;  

    setOrderDetails(calculatedOrderDetails);

    // Group cart items by seller_id
    const groupedItems = cartItems.reduce((acc, item) => {
      const sellerId = item.product.current_seller.id;
      if (!acc[sellerId]) {
      acc[sellerId] = {
          seller_name: item.product.current_seller.name,
          items: [],
      };
      }
      acc[sellerId].items.push(item);
      return acc;
    }, {});
  
    // Convert grouped items to deliveries
    const calculatedDeliveries = Object.values(groupedItems).map((group, index) => ({
      id: index + 1,
      date: "Giao vào: " + generateDeliveryDateTime(3), // Replace with actual delivery date
      items: group.items.map((item) => ({
      name: item.product.name,
      image: item.product.thumbnail_url,
      quantity: `x${item.quantity}`,
      price: item.product.price * item.quantity,
      originalPrice: item.product.original_price * item.quantity,
      shipper: group.seller_name,
      })),
    }));

    setDeliveries(calculatedDeliveries);

  }, []);

  // Function to convert cart items to order items
  const convertCartItemsToOrderItems = (cartItems) => {
    return cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));
  };

  // get shipping address from user
  const getShippingAddress = async () => {
    const response = await getUserByEmail(axiosPrivate, user.email);
    return response.shipping_address;
  };
  
  const handlePayment = async () => {
    const orderItems = convertCartItemsToOrderItems(cartItems);
    const shippingAddress = await getShippingAddress();
    debugger;
    const response = await createOrder(axiosPrivate, orderItems, orderDetails.total, shippingAddress, selectedPayment);
    if (!response.success) {
      alert('Đặt hàng thất bại');
      return;
    }

    // get order id
    const orderId = response.data.id;
    
    if (selectedPayment === 'cash') {      
        alert('Thanh toán tiền mặt khi nhận hàng');
    } else if (selectedPayment === 'stripe') {
        const totalPrice = orderDetails.total;
        handleCheckout(axiosPrivate, cartItems, totalPrice, orderId);
    } else if (selectedPayment === 'vnpay') {
      // orderInfo include name, price, quantity  
      const orderInfo = cartItems.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));
      const amount = orderDetails.total;
      debugger;
      await createPaymentUrl(axiosPrivate, orderInfo, amount, orderId);
      
      // update order status to processing from order id
      await updateOrder(axiosPrivate, orderId, 'processing', shippingAddress);

    } else if (selectedPayment === 'paypal') {
      setOrderIdGlobal(orderId);
      setShowPayPal(true);
    }

    // remove selected items from cart
    const itemIds = cartItems.map((item) => item.product_id);
    await deleteCartItem(axiosPrivate, { itemIds });

    if (selectedPayment === 'cash') {
      navigate('/checkout/success');
    }
  };


  return (
    deliveries &&
    <div className="max-w-6xl mx-auto p-4 flex gap-6">
      {/* Left Column - Delivery and Payment */}
      <div className="flex-grow space-y-6">
        {/* Delivery Groups */}
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Package className="w-5 h-5" />
                <span className="font-medium">
                  Gói {delivery.id}: {delivery.date}
                </span>
              </div>

              {delivery.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-4 py-3 border-t">
                  <div className="w-16 h-16 bg-gray-100 rounded">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium text-red-600">
                        {item.price.toLocaleString()}đ
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {item.originalPrice.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">{item.shipper}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Chọn hình thức thanh toán</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={selectedPayment === 'cash'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-3"
              />
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <span>Thanh toán tiền mặt</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={selectedPayment === 'paypal'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-3"
              />
              <img 
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                alt="PayPal" 
                className="w-8 h-8 mr-3 rounded"
              />
              <span>PayPal</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={selectedPayment === 'stripe'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-3"
              />
              <img src="https://cdn.brandfetch.io/idxAg10C0L/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="Stripe" className="w-8 h-8 mr-3 rounded" />
              <span>Ví Stripe</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="vnpay"
                checked={selectedPayment === 'vnpay'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-3"
              />
              <img src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="VNPAY" className="w-8 h-8 mr-3 rounded" />
              <div>
                <span>VNPAY</span>
                <p className="text-sm text-gray-500">Quét Mã QR từ ứng dụng ngân hàng</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-80">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Đơn hàng</h3>
          
            <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span>{orderDetails.subtotal.toLocaleString()}đ</span>
                </div>         
                            
                <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{orderDetails.shipping.toLocaleString()}đ</span>
                </div>
                        
                <div className="flex justify-between text-green-600">
                <span>Giảm giá trực tiếp</span>
                <span>{orderDetails.discount.toLocaleString()}đ</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                <span>Mã khuyến mãi từ nhà bán</span>
                <span>{orderDetails.sellerDiscount.toLocaleString()}đ</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                <span>Giảm giá vận chuyển</span>
                <span>{orderDetails.shippingDiscount.toLocaleString()}đ</span>
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between font-medium mb-1">
                <span>Tổng tiền thanh toán</span>
                <span className="text-red-600 text-xl">
                    {orderDetails.total.toLocaleString()}đ
                </span>
                </div>
                <p className="text-green-600 text-sm text-right">
                (Tiết kiệm {orderDetails.totalSavings.toLocaleString()}đ)
                </p>
            </div>

            <button
                className="w-full bg-red-500 text-white rounded-lg py-3 mt-4 hover:bg-red-600"
                onClick={handlePayment}
            >
                Đặt hàng
            </button>
        </div>
        {showPayPal && orderIdGlobal && (
          <PayPalWrapper
            cartItems={cartItems}
            totalPrice={orderDetails.total}
            orderId={orderIdGlobal}
            onSuccess={(orderData) => {
              console.log('Payment successful', orderData);
              // Handle successful payment (e.g., redirect to success page)
            }}
            onError={(err) => {
              console.error('Payment error', err);
              // Handle payment error (e.g., show error message)
            }}
          />
        )}
      </div>
      
    </div>

    )
};

export default PaymentPage;