import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from '../utils/firebase'; // Đường dẫn tới firebase configuration

/**
 * Hàm upload một hoặc nhiều ảnh lên Firebase Storage
 * @param {Array} imageFiles - Danh sách file ảnh cần upload
 * @param {String} folderName - Tên thư mục trong Firebase Storage
 * @returns {Array} - Mảng chứa URL của các ảnh đã upload
 */
export const uploadImages = async (imageFiles, folderName = 'products') => {
    if (!imageFiles || imageFiles.length === 0) return [];

    try {
        const uploadPromises = imageFiles.map(async (image) => {
            const imageRef = ref(storage, `${folderName}/${image.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return {
                thumbnail_url: downloadURL,
            };
        });

        return Promise.all(uploadPromises); // Trả về danh sách ảnh đã upload
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images');
    }
};