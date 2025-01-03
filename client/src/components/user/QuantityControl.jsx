import { useState } from 'react';
import { Button, InputNumber, Space } from 'antd';

const QuantityControl = ({ maxNumber, defaultValue = 1, onChange }) => {
    const [quantity, setQuantity] = useState(defaultValue);

    const handleAdd = () => {
        if (quantity < maxNumber) {
            setQuantity(quantity + 1);
            onChange && onChange(quantity + 1);
        }
    }

    const handleSubtract = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            onChange && onChange(quantity - 1);
        }
    }

    const handleInputChange = (value) => {
        if (value !== null && value >= 1 & value <= maxNumber) {
            setQuantity(value);
            onChange && onChange(value);
        }
    };

    const handleKeyPress = (e) => {
        // Prevent non-numeric input
        if (!/^\d*$/.test(e.key)) {
            e.preventDefault();
        }    
    }

    return (
        <Space>
            <Button onClick={handleSubtract} disabled={quantity <= 1}>-</Button>
            <InputNumber
                min={1}
                max={maxNumber}
                value={quantity}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                formatter={(value) => (value ? Math.min(value, maxNumber) : 1)}
                parser={(value) => value.replace(/[^\d]/g, '')}
                style={{ width: 60 }}
            />
            <Button onClick={handleAdd} disabled={quantity >= maxNumber}>+</Button>
        </Space>
    )
}

export default QuantityControl;