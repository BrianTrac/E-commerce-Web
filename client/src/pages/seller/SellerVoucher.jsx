import React, { useState } from "react";
import { Card, Button } from 'antd';

//  Voucher
//  id: number;
//  quantity: number;
//  discount: number;
//  startDate: Date;
//  endDate: Date;
//  products: Product[];
//  storeId: StoreId;

const SellerVoucher = () => {
    // useEffect(() => {
    //     fetchVouchers();
    // }, []);

    // const fetchVouchers = () => {
    //     try {
    //         // Fetch all vouchers


    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const [selectedVoucherId, setSelectedVoucherId] = useState("");
    const [voucherShop, setVoucherShop] = useState({discount: "10", startDate: "", endDate: ""});
    const [voucherForProduct, setVoucherForProduct] = useState({discount: "10", startDate: "", endDate: ""});

    const [voucherData, setVoucherData] = useState([
        { id: 1, quantity: 10, discount: 10, startDate: new Date(), endDate: new Date(), products: [], storeId: null },
        { id: 2, quantity: 20, discount: 15, startDate: new Date(), endDate: new Date(), products: [], storeId: null },
        { id: 3, quantity: 30, discount: 20, startDate: new Date(), endDate: new Date(), products: [], storeId: null },
        { id: 4, quantity: 40, discount: 30, startDate: new Date(), endDate: new Date(), products: [], storeId: null },
    ]);

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


    const handleAddVoucherShop = () => {
        // Kiểm tra xem các thông tin bắt buộc có được nhập đầy đủ không
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
    
        // Tạo ID mới cho voucher
        const newId = voucherData.length > 0 ? Math.max(...voucherData.map((v) => v.id)) + 1 : 1;
    
        // Tạo đối tượng voucher mới
        const newVoucherEntry = {
            id: newId,
            quantity: 0, // Sử dụng giá trị từ voucherForProduct
            discount: parseInt(voucherShop.discount), // Chuyển discount thành số
            startDate: new Date(voucherShop.startDate), // Chuyển đổi startDate thành đối tượng Date
            endDate: new Date(voucherShop.endDate), // Chuyển đổi endDate thành đối tượng Date
            products: [], // Có thể điền danh sách sản phẩm nếu có
            store: {}, // Có thể điền thông tin cửa hàng nếu có
        };
    
        setVoucherData([...voucherData, newVoucherEntry]);
    
        // Reset voucherForProduct 
        setVoucherShop({ discount: "", startDate: "", endDate: "", quantity: 0 });
    
        alert("Thêm voucher thành công!");
    };

    const handleAddVoucherForProduct = () => {
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
    
        // Tạo ID mới cho voucher
        const newId = voucherData.length > 0 ? Math.max(...voucherData.map((v) => v.id)) + 1 : 1;
    
        const newVoucherEntry = {
            id: newId,
            quantity: 0, // Sử dụng giá trị từ voucherForProduct
            discount: parseInt(voucherForProduct.discount), // Chuyển discount thành số
            startDate: new Date(voucherForProduct.startDate), // Chuyển đổi startDate thành đối tượng Date
            endDate: new Date(voucherForProduct.endDate), // Chuyển đổi endDate thành đối tượng Date
            products: [], // Có thể điền danh sách sản phẩm nếu có
            storeId: {}, // Có thể điền thông tin cửa hàng nếu có
        };
    
        setVoucherData([...voucherData, newVoucherEntry]);
    
        // Reset voucherForProduct
        setVoucherForProduct({ discount: "", startDate: "", endDate: "", quantity: 0 });
    
        alert("Thêm voucher thành công!");
    };

    const handleDeleteVoucher = () => {

        if (!selectedVoucherId) {
            alert("Vui lòng chọn voucher cần xóa");
            return;
        }
        const updatedVoucherData = voucherData.filter((voucher) => voucher.id !== parseInt(selectedVoucherId));
        setVoucherData(updatedVoucherData);
        alert("Xóa voucher thành công!");
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
                            <p>Phần trăm giảm</p>
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
                            <p>Ngày bắt đầu</p>
                            <input aria-label="Date and time" type="datetime-local" 
                            className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4 focus:outline-none" 
                            name="startDate"
                            value={voucherShop.startDate}
                            onChange={handleChangeVoucherShop}
                            onClick={(e) => e.target.showPicker()}/>
                        </div>

                        <div>
                            <p>Ngày kết thúc</p>
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
                        <h2 className="text-xl font-semibold">Set voucher cho sản phẩm cụ thể</h2>
                    </div>
                    {/* Content for specific product vouchers */}
                    <div>
                        <div>
                            <p>Phần trăm giảm</p>
                            <select className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4" 
                            value={voucherForProduct.discount}
                            name="discount" 
                            onChange={handleChangeVoucherForProduct}
                            >
                                <option value="" disabled hidden></option>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>

                        <div>
                            <p>Ngày bắt đầu</p>
                            <input aria-label="Date and time" type="datetime-local" 
                            className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                            name="startDate"
                            onChange={handleChangeVoucherForProduct}
                            onClick={(e) => e.target.showPicker()} />
                        </div>

                        <div>
                            <p>Ngày kết thúc</p>
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

            {/* Delete Voucher */}
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
                            {`Giảm ${voucher.discount}% - Số lượng: ${voucher.quantity}`}
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
        </Card>
    );
}


export default SellerVoucher;