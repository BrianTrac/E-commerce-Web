import { useState, useEffect } from 'react';
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

    if (isAuthenticated && user.role.toLowerCase() === 'user') {
      fetchCartItems();
      getCartSummaryInfo();
    }
  }, [cartUpdated]);

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleCartItemChange = async (id, quantity, checked) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product_id === id ? { ...item, quantity, selected: checked } : item))
    );

    await updateCartItem(axiosPrivate, { itemId: id, quantity, selected: checked });
    getCartSummaryInfo();
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

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    navigate('/checkout/payment', { state: { cartItems: selectedItems } });
  };

  return (
    <div className="p-5">
      <Title level={2} className="mb-4">Giỏ hàng</Title>
      <Divider />

      <Card className="w-full my-4">
        <Row align="middle" className="font-bold">
          <Col span={2}></Col>
          <Col span={8}>Sản phẩm</Col>
          <Col span={4}>Giá</Col>
          <Col span={4}>Số lượng</Col>
          <Col span={4}>Tổng tiền</Col>
          <Col span={2}></Col>
        </Row>
      </Card>

      <div className="space-y-4">
        {Object.entries(groupedItems).map(([sellerId, { seller_name, items }]) => (
          <Card key={sellerId} className="w-full">
            <div className="flex items-center p-4 border-b">
              <Checkbox
                checked={items.every((item) => item.selected)}
                onChange={(e) => items.forEach((item) => handleCartItemChange(item.product_id, item.quantity, e.target.checked))}
              />
              <ShopOutlined className="ml-2" />
              <Text className="ml-2 font-semibold">{seller_name}</Text>
            </div>

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
                    <Col span={8} className="flex items-center">
                      <img
                        src={item.product.thumbnail_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover cursor-pointer"
                        onClick={() => navigate(`/product/${item.product.url_key}`)}
                      />
                      <Text className="ml-4 font-medium">{item.product.name}</Text>
                    </Col>
                    <Col span={4}>
                      <Text className="text-red-600">{formatCurrency(item.product.price)}</Text>
                    </Col>
                    <Col span={4}>
                      <Space>
                        <Button
                          onClick={() => handleCartItemChange(item.product_id, Math.max(1, item.quantity - 1), item.selected)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => handleCartItemChange(item.product_id, value, item.selected)}
                        />
                        <Button
                          onClick={() => handleCartItemChange(item.product_id, Math.min(99, item.quantity + 1), item.selected)}
                          disabled={item.quantity >= item.product.qty}
                        >
                          +
                        </Button>
                      </Space>
                    </Col>
                    <Col span={4}>
                      <Text className="text-red-600 font-medium">{formatCurrency(item.product.price * item.quantity)}</Text>
                    </Col>
                    <Col span={2}>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.product_id)}
                        danger
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Divider />
      <Row justify="end" className="p-4">
        <Col span={8}>
          <Card>
            <Title level={4} className="mb-4">Tóm tắt</Title>
            <div className="flex justify-between mb-4">
              <Text>Tổng tiền:</Text>
              <Text>{formatCurrency(cartSummary.total_price)}</Text>
            </div>
            <Button
              type="primary"
              className="w-full"
              onClick={handleCheckout}
            >
              Thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
