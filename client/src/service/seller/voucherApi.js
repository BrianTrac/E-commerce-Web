// services/voucheApi.js

export const getVouchers = async (axiosPrivate, page = 1, limit = 10) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/voucher`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
};

export const addVoucher = async (axiosPrivate, voucherData) => {
    try {
        const response = await axiosPrivate.post(`/api/seller/voucher/add`, voucherData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add voucher');
    }
}

export const deleteVoucher = async (axiosPrivate, voucherId) => {
    try {
        const response = await axiosPrivate.delete(`/api/seller/voucher/delete/${voucherId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete voucher');
    }
}

export const updateVoucher = async (axiosPrivate, voucherId, voucherData) => {
    try {
        const response = await axiosPrivate.patch(`/api/seller/voucher/update/${voucherId}`, voucherData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update voucher');
    }
}

export const getVoucherById = async (axiosPrivate, voucherId) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/voucher/${voucherId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch voucher');
    }
}