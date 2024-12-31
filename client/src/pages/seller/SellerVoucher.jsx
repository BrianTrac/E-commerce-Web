import React, { useEffect, useState } from "react";
import { Card, Button, Table, Tooltip, Modal, message } from 'antd';
import { getVoucher, addVoucher, deleteVoucher } from '../../service/seller/voucherApi';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

//  Voucher
//  id: number;
//  discount: number;
//  startDate: Date;
//  endDate: Date;
//  products: product_id;
//  storeId: StoreId;

const SellerVoucher = () => {

    const [voucherShop, setVoucherShop] = useState({discount: "10", startDate: "", endDate: ""});
    const [voucherForProduct, setVoucherForProduct] = useState({discount: "10", startDate: "", endDate: ""});
    const [voucherData, setVoucherData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Discount', dataIndex: 'discount', key: 'discount', render: (discount) => <span>{discount}%</span> },
        { title: 'Start date', dataIndex: 'start_date', key: 'startDate', render: (date) => <span>{new Date(date).toLocaleString()}</span> },
        { title: 'End date', dataIndex: 'end_date', key: 'endDate', render: (date) => <span>{new Date(date).toLocaleString()}</span> },
        { title: 'Action', dataIndex: '', key: 'action', render: (_, record) => 
            <Tooltip title="Delete">
                <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                className="text-red-600 p-0 hover:text-red-800"
                />
            </Tooltip> 
        },
    ];

    useEffect(() => {
        loadVouchers();
    }, [pagination.current]);

    const loadVouchers = async () => {
        try {
            const response = await getVoucher(pagination.current, pagination.pageSize);
            setVoucherData(response.vouchers);
            setPagination({ ...pagination, total: response.totalItems });
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeVoucherShop = (e) => {
        const { name, value } = e.target;
        setVoucherShop(prevState => ({
            ...prevState,  // Giữ lại các giá trị cũ của voucherShop
            [name]: value  // Chỉ cập nhật giá trị của trường name
        }));
    };

    const handleChangeVoucherForProduct = (e) => {
        const { name, value } = e.target;
        setVoucherShop(prevState => ({
            ...prevState,  // Giữ lại các giá trị cũ của voucherShop
            [name]: value  // Chỉ cập nhật giá trị của trường name
        }));
    };


    const handleAddVoucherShop = async() => {
        // Kiểm tra xem các thông tin bắt buộc có được nhập đầy đủ không
        if (!voucherShop.discount) {
            alert("Please choose percentage off for voucher!");
            return;
        }
        if (!voucherShop.startDate) {
            alert("Please choose start date for voucher!");
            return;
        }
        if (!voucherShop.endDate) {
            alert("Please choose end date voucher!");
            return;
        }

        if (new Date(voucherShop.startDate) > new Date(voucherShop.endDate)) {
            alert("Start date must be before end date!");
            return;
        }

        const newVoucher = await addVoucher(voucherShop);
        if (!newVoucher) {
            alert("Add voucher unsuccessfully!");
            return;
        }
    
        setVoucherData([...voucherData, newVoucher.voucher]);
    
        // Reset voucherForProduct 
        setVoucherShop({ discount: "", startDate: "", endDate: "" });
        alert("Add voucher successfully!");
    };

    const handleAddVoucherForProduct = async() => {
        if (!voucherShop.discount) {
            alert("Vui lòng nhập phần trăm giảm cho voucher!");
            return;
        }
        if (!voucherShop.startDate) {
            alert("Vui lòng nhập ngày bắt đầu cho voucher!");
            return;
        }
        if (!voucherShop.endDate) {
            alert("Vui lòng nhập ngày kết thúc cho voucher!");
            return;
        }

        if (new Date(voucherShop.startDate) > new Date(voucherShop.endDate)) {
            alert("Ngày kết thúc phải sau ngày bắt đầu!");
            return;
        }
    
        const newVoucher = await addVoucher(voucherForProduct);
        if (!newVoucher) {
            alert("Thêm voucher không thành công!");
            return;
        }

        setVoucherData([...voucherData, newVoucher.voucher]);
    
        // Reset voucherForProduct
        setVoucherForProduct({ discount: "", startDate: "", endDate: "" });
    
        alert("Add voucher successfully!");
    };

    const handleDelete = (voucherId) => {
        confirm({
          title: 'Are you sure you want to delete this voucher?',
          icon: <ExclamationCircleOutlined />,
          content: 'This action cannot be undone.',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            try {
              await deleteVoucher(voucherId);
              message.success('Voucher deleted successfully');
              loadVouchers();
            } catch (error) {
              message.error(error.message || 'Failed to delete voucher');
            }
          },
        });
      };

    return (
        <Card className="shadow-md">
            <div className="flex flex-row ">
                {/* Voucher Shop */}
                <div className="flex-1 p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-semibold">Set voucher shop</h2>
                    </div>
                    {/* Content for voucher shop */}
                    <div>
                        <div>
                            <p>Percentage off</p>
                            <select 
                                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4" 
                                name="discount" 
                                onChange={handleChangeVoucherShop}
                                value={voucherShop.discount}
                            >
                                <option value="" disabled hidden></option>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>

                        <div>
                            <p>Start date</p>
                            <input aria-label="Date and time" type="datetime-local" 
                            className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4 focus:outline-none" 
                            name="startDate"
                            value={voucherShop.startDate}
                            onChange={handleChangeVoucherShop}
                            onClick={(e) => e.target.showPicker()}/>
                        </div>

                        <div>
                            <p>End date</p>
                            <input aria-label="Date and time" type="datetime-local" 
                                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                                name="endDate"
                                value={voucherShop.endDate}
                                onChange={handleChangeVoucherShop}
                                onClick={(e) => e.target.showPicker()} 
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                onClick={handleAddVoucherShop}
                                style={{ marginLeft: '10px', position: 'right' }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Voucher for Specific Products */}
                <div className="flex-1 p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-semibold">Set voucher for specific product</h2>
                    </div>
                    {/* Content for specific product vouchers */}
                    <div>
                        <div>
                            <p>Percentage off</p>
                            <select className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4" 
                            value={voucherForProduct.discount}
                            name="discount" 
                            onChange={handleChangeVoucherForProduct}
                            >
                                <option value="" disabled hidden></option>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                                <option value="20">20%</option>
                                <option value="25">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>

                        <div>
                            <p>Start date</p>
                            <input aria-label="Date and time" type="datetime-local" 
                            className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                            name="startDate"
                            onChange={handleChangeVoucherForProduct}
                            onClick={(e) => e.target.showPicker()} />
                        </div>

                        <div>
                            <p>End date</p>
                            <input aria-label="Date and time" type="datetime-local" 
                            className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                            name="endDate"
                            onChange={handleChangeVoucherForProduct}
                            onClick={(e) => e.target.showPicker()} />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                onClick={handleAddVoucherForProduct}
                                style={{ marginLeft: '10px', position: 'right' }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-col justify-between mt-6 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Vouchers</h2>
                </div>
                <Table
                    columns={columns}
                    dataSource={voucherData}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        position: ['bottomCenter'],
                    }}
                />
            </div>

            {/* Delete Voucher 
            <div className="flex-col justify-between mt-6 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Xóa voucher</h2>
                </div>

                <div className="flex justify-between w-full">
                    <select className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4" 
                        value={selectedVoucherId}
                        onChange={(e) => setSelectedVoucherId(e.target.value)}>
                        <option value="" disabled hidden>
                            Chọn voucher cần xóa
                        </option>
                        {voucherData.map((voucher) => (
                            <option key={voucher.id} value={voucher.id}>
                            {`ID: ${voucher.id} - Giảm ${voucher.discount}%`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="primary"
                        onClick={() => handleDeleteVoucher()}
                        style={{ marginLeft: '10px', position: 'right' }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            */}
        </Card>
    );
}


export default SellerVoucher;