// services/voucheApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getVoucher = async (storeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/seller/voucher/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch voucher');
    }
};

export const addVoucher = async (voucherData) => {
    try {
        const response = await axios.post(`${BASE_URL}/seller/voucher/add`, voucherData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add voucher');
    }
}

export const deleteVoucher = async (voucherId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/seller/voucher/delete/${voucherId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete voucher');
    }
}