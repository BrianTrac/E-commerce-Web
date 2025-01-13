import { useState, useEffect, use } from 'react';
import { Row, Col, Card, Button, InputNumber, Typography, Divider, Space, Checkbox } from 'antd';
import { DeleteOutlined, ShopOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import { getCartItems, updateCartItem, deleteCartItem, getCartSummary } from '../../redux/services/user/cartService';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setCartQuantity } from "../../redux/reducers/user/cartReducer";
import { selectAuth } from '../../redux/reducers/user/authReducer';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [cartSummary, setCartSummary] = useState({ total_price: 0, total_items: 0 });
  const [cartUpdated, setCartUpdated] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (!cartUpdated) return;

    const fetchCartItems = async () => {
      const response = await getCartItems(axiosPrivate);

      if (!response.success) {
        return;
      }

      setCartItems(response.cartItems);
      setCartUpdated(false);
    };
    debugger;
    // check if user is authenticated before fetching cart items
    if (isAuthenticated && user.role.toLowerCase() === 'user') {
      fetchCartItems();
      getCartSummaryInfo();
    }

  }, [cartUpdated]);

  // Group cart items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    const sellerId = item.product.current_seller.id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller_name: item.product.current_seller.name,
        items: []
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {});

  const handleCartItemChange = async (id, quantity, checked) => {
    // Optimistically update the UI
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product_id === id ? { ...item, quantity, selected: checked } : item))
    );

    // Update backend
    await updateCartItem(axiosPrivate, { itemId: id, quantity, selected: checked });
    getCartSummaryInfo();
    //  setCartUpdated(true);
  };

  const handleRemoveItem = async (id) => {
    const response = await deleteCartItem(axiosPrivate, { itemIds: [id] });
    if (response.success) {
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
      dispatch(setCartQuantity(cartItems.length - 1));
    }
    setCartUpdated(true);
  };

  const getCartSummaryInfo = async () => {
    const response = await getCartSummary(axiosPrivate);
    if (!response.success) {
      return;
    }
    setCartSummary(response.cartSummary);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.url_key}`, { state: { product } });
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);

    navigate('/checkout/payment', { state: { cartItems: selectedItems } });
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <Divider />

      {/* Header */}

      <Card className="w-full my-4">
        <Row align="middle" className="text-left font-bold">
          <Col span={2}></Col>
          <Col span={6}>Product</Col>
          <Col span={3}>Price</Col>
          <Col span={5}>Quantity</Col>
          <Col span={3}>Total</Col>
          <Col span={3}></Col>
        </Row>
      </Card>

      {/* Seller Groups */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([sellerId, { seller_name, items }]) => (
          <Card key={sellerId} className="w-full">
            {/* Seller Header */}
            <div className="flex items-center p-4 border-b">
              <Checkbox className="mr-4"
                checked={items.every((item) => item.selected)}
                onChange={(e) => items.forEach((item) => handleCartItemChange(item.product_id, item.quantity, e.target.checked))}
              />
              <ShopOutlined className="w-5 h-5 mr-2" />
              <span className="font-semibold">{seller_name}</span>
            </div>

            {/* Seller's Items */}
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product_id} className="p-4">
                  <Row align="middle">
                    <Col span={2}>
                      <Checkbox
                        checked={item.selected}
                        onChange={(e) => handleCartItemChange(item.product_id, item.quantity, e.target.checked)}
                      />
                    </Col>
                    <Col span={6} >
                      <div className="flex items-center justify-start text-left space-x-10 mr-20">
                        <img
                          src={item.product.thumbnail_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover"
                          onClick={() => handleProductClick(item.product)}
                        />
                        <p className="font-medium">{item.product.name}</p>
                      </div>
                    </Col>
                    <Col span={3}>
                      <p className="text-red-600">VND {item.product.price}</p>
                    </Col>
                    <Col span={5}>
                      <Space>
                        <Button
                          onClick={() => handleCartItemChange(item.product_id, Math.max(1, item.quantity - 1), item.selected)}
                          disabled={item.quantity <= 1}
                          className="px-3"
                        >
                          -
                        </Button>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => handleCartItemChange(item.product_id, value, item.selected)}
                          className="w-16 text-center"
                        />
                        <Button
                          onClick={() => handleCartItemChange(item.product_id, Math.min(99, item.quantity + 1), item.selected)}
                          className="px-3"
                          disabled={item.quantity >= item.product.qty}
                        >
                          +
                        </Button>
                      </Space>
                    </Col>
                    <Col span={3}>
                      <p className="text-red-600 font-medium">VND {(item.product.price * item.quantity) || 0}</p>
                    </Col>
                    <Col span={3}>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Divider />
      <Row justify="end" className="sticky bottom-0 w-full p-4">
        <Col span={8}>
          <Card>
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="flex justify-between mb-4">
              <span>Total Price:</span>
              <span>VND {cartSummary.total_price || 0}</span>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Cart;
