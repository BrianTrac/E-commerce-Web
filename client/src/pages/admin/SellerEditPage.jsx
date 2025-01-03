import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Spin } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { fetchOneSeller } from '../../redux/actions/admin/sellerManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { uploadImages } from '../../helpers/upload';

const SellerEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const { currentSeller, loading } = useSelector(state => state.admin.sellers);
    const [error, setError] = useState(null);
    const [imageUploads, setImageUploads] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        isOfficial: false,
        icon: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load seller data
    useEffect(() => {
        const loadSeller = async () => {
            try {
                if (id) {
                    await dispatch(fetchOneSeller({ id, axiosInstance: axiosPrivate })).unwrap();
                }
            } catch (err) {
                setError(err.message || 'Failed to load seller information');
            }
        };

        loadSeller();
    }, [id, dispatch, axiosPrivate]);

    useEffect(() => {
        if (currentSeller) {
            setFormData({
                name: currentSeller.name || '',
                isOfficial: currentSeller.isOfficial || false,
                icon: currentSeller.icon || ''
            });
        }
    }, [currentSeller]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    icon: e.target.result
                }));
            };
            reader.readAsDataURL(file);
            setImageUploads(prev => [file]);
        } else {
            setFormData(prev => ({
                ...prev,
                icon: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const imageUploadedUrls = await uploadImages(imageUploads, 'sellers');
            console.log(imageUploadedUrls);
            const response = await axiosPrivate.put(
                `/api/admin/seller/${id}/edit`,
                {
                    name: formData.name,
                    isOfficial: formData.isOfficial,
                    icon: imageUploadedUrls[0] ? imageUploadedUrls[0].thumbnail_url : formData.icon
                }
            );
            if (response.status === 200) {
                navigate('/admin/seller-management');
            } else {
                throw new Error(response.data.message || 'Failed to update seller');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while updating the seller');
        } finally {
            setIsSubmitting(false);
        }
    };



    if (loading) { return <Spin />; }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/seller-management')}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay về</span>
                </button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chỉnh sửa</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <ImageUpload
                            currentImage={formData.icon}
                            onImageChange={handleImageChange}
                            className="mb-6"
                        />

                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium">
                                Tên shop
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isOfficial"
                                name="isOfficial"
                                checked={formData.isOfficial}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="isOfficial" className="text-sm font-medium">
                                Trạng thái official
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/seller-management')}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerEditPage;