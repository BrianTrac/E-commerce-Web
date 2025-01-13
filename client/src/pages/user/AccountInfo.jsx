import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Descriptions, Spin, message, Button, Tooltip } from 'antd';
import { UserOutlined, MailOutlined, EnvironmentOutlined, CopyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AccountInfo = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get('api/users/info');
                if (response.data) {
                    setUserDetails(response.data);
                }
            } catch (error) {
                message.error('Không thể tải thông tin người dùng');
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [axiosPrivate]);

    const getFullAddress = () => {
        if (!userDetails?.shipping_address) return 'Chưa có địa chỉ';

        const { street, city, state, zipCode, country } = userDetails.shipping_address;
        if (!street && !city && !state && !zipCode && !country) {
            return 'Chưa có địa chỉ';
        }
        return `${street || ''}, ${city || ''}, ${state || ''} ${zipCode || ''}, ${country || ''}`.replace(/,\s+,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success(`Đã sao chép ${field}`);
        }).catch(() => {
            message.error('Không thể sao chép');
        });
    };

    const renderWithCopyButton = (content, field) => (
        <div className="flex justify-between items-center w-full">
            <span>{content}</span>
            {content !== 'N/A' && content !== 'Chưa có địa chỉ' && (
                <Tooltip title="Sao chép">
                    <Button
                        type="text"
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => handleCopy(content, field)}
                    />
                </Tooltip>
            )}
        </div>
    );

    if (loading) {
        return (
            <Card style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </Card>
        );
    }

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
            </div>
            <Card
                title={
                    <Title level={4} style={{ margin: 0 }}>Thông tin tài khoản</Title>
                }
            >
                <Descriptions column={1} layout="vertical">
                    <Descriptions.Item
                        label={
                            <Space>
                                <UserOutlined />
                                <span>Tên đăng nhập</span>
                            </Space>
                        }
                    >
                        {renderWithCopyButton(userDetails?.username || 'N/A', 'tên đăng nhập')}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <Space>
                                <MailOutlined />
                                <span>Email</span>
                            </Space>
                        }
                    >
                        {renderWithCopyButton(userDetails?.email || 'N/A', 'email')}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <Space>
                                <EnvironmentOutlined />
                                <span>Địa chỉ giao hàng</span>
                            </Space>
                        }
                    >
                        {renderWithCopyButton(getFullAddress(), 'địa chỉ')}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default AccountInfo;