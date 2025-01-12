import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct } from '../../service/seller/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Select, Upload, message, Space, Table, Typography } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import useCategories from '../../hooks/useCategories';
import { uploadImages } from '../../helpers/upload';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { RichTextEditor } from '../../components/seller/RichTextEditor';

const { Option } = Select;
const { TextArea } = Input;


const SellerEditProduct = () => {
  const { productId } = useParams();
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const [imageUploads, setImageUploads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specifications, setSpecifications] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { categories } = useCategories(searchTerm, 1, 50);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(axiosPrivate, productId);
        const product = productResponse.data;

        form.setFieldsValue({
          name: product.name,
          discount_rate: product.discount_rate,
          original_price: parseFloat(product.original_price),
          short_description: product.short_description,
          description: product.description,
          qty: product.qty,
        });
        setDescription(product.description);

        const parsedSpecifications = Array.isArray(product.specifications)
          ? product.specifications
          : JSON.parse(product.specifications || '[]');
        setSpecifications(parsedSpecifications);

        const thumbnails = product.thumbnails || [];
        const formattedThumbnails = thumbnails.map((url, index) => ({
          uid: `existing-${index}`,
          name: url.split('/').pop(),
          status: 'done',
          url: url,
        }));

        setPreviewImages(formattedThumbnails);
        setSelectedCategory({ value: product.category_id, label: product.category_name });

        form.setFieldsValue({
          category: product.category_id,
        });
      } catch (error) {
        console.error('Error loading product:', error);
        message.error('Không thể tải dữ liệu sản phẩm!');
      }
    };

    fetchData();
  }, [productId, form]);

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 8) {
      fileList = fileList.slice(0, 8);
    }

    const updatedPreviews = fileList.map((file) => ({
      uid: file.uid,
      name: file.name || file.url.split('/').pop(),
      status: file.status || 'done',
      url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : null),
      originFileObj: file.originFileObj,
    }));
    setPreviewImages(updatedPreviews);
    setImageUploads(fileList.filter((file) => file.originFileObj).map((file) => file.originFileObj));
  };

  const handleRemoveImage = (file) => {
    setPreviewImages(previewImages.filter((img) => img.uid !== file.uid));
    setImageUploads(imageUploads.filter((upload) => upload.name !== file.name));
  };

  let showLimitWarning = false;

  const validateFileTypeAndLimit = (file, fileList) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      message.error(`${file.name} không phải là định dạng ảnh hợp lệ!`);
      return Upload.LIST_IGNORE;
    }

    if (fileList.length >= 8 && !showLimitWarning) {
      showLimitWarning = true;
      message.error('Bạn đã đạt giới hạn 8 ảnh. Không thể thêm ảnh mới.');
      return Upload.LIST_IGNORE;
    }


    return false;
  };

  const onSubmit = async (values) => {
    try {
      const newImageUrls = await uploadImages(imageUploads);
      const existingImageUrls = previewImages
        .filter((img) => img.uid.startsWith('existing'))
        .map((img) => img.url);

      const allImageUrls = [...existingImageUrls, ...newImageUrls.map((img) => img.thumbnail_url)];
      const formattedImages = allImageUrls.map((url) => ({ thumbnail_url: url }));

      const formattedSpecifications = specifications
        .filter((spec) => spec.name.trim() !== '')
        .map((spec) => ({
          ...spec,
          attributes: spec.attributes.filter(
            (attr) => attr.name.trim() !== '' && attr.value.trim() !== ''
          ),
        }));

      const updatedData = {
        ...values,
        description: description,
        category_id: selectedCategory?.value,
        category_name: selectedCategory?.label,
        images: formattedImages,
        thumbnail_url: allImageUrls[0] || '',
        price: values.original_price * (1 - (values.discount_rate || 0) / 100),
        specifications: formattedSpecifications,
      };

      const response = await updateProduct(axiosPrivate, productId, updatedData);
      message.success(response.message);
      navigate('/seller/product-management');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
    }
  };


  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => navigate(-1)} className="mb-4" icon={<MinusCircleOutlined />}>Quay lại</Button>
      <Typography.Title level={2} className="text-center">Chỉnh Sửa Sản Phẩm</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Tên sản phẩm là bắt buộc' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: 'Danh mục là bắt buộc' }]}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục"
            filterOption={false}
            onSearch={(value) => setSearchTerm(value)}
            onChange={(value) => {
              const category = categories.find((cat) => cat.id === value);
              if (category) {
                setSelectedCategory({ value: category.id, label: category.name });
                form.setFieldsValue({ category: category.id });
              }
            }}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="images"
          label="Ảnh sản phẩm"
          rules={[
            {
              validator: (_, value) => {
                if (previewImages.length === 0) {
                  return Promise.reject(new Error('Vui lòng tải lên ít nhất một ảnh!'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            accept='image/*'
            listType="picture-card"
            fileList={previewImages}
            onChange={handleImageChange}
            onRemove={handleRemoveImage}
            beforeUpload={(file, fileList) => validateFileTypeAndLimit(file, fileList)}
            multiple
          >
            {previewImages.length < 8 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="discount_rate"
          label="Tỷ lệ giảm giá (%)"
          rules={[{ type: 'number', min: 0, max: 100, message: 'Tỷ lệ giảm giá phải từ 0 đến 100' }]}
        >
          <InputNumber className="w-full" placeholder="Nhập tỷ lệ giảm giá" />
        </Form.Item>

        <Form.Item
          name="original_price"
          label="Giá gốc"
          rules={[{ required: true, message: 'Giá gốc là bắt buộc' }]}
        >
          <InputNumber className="w-full" placeholder="Nhập giá gốc" />
        </Form.Item>

        <Form.Item name="short_description" label="Miêu tả ngắn">
          <Input.TextArea rows={3} placeholder="Nhập miêu tả ngắn" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Miêu tả chi tiết"
          initialValue={description}
        >
          <RichTextEditor
            value={description}
            onChange={(newValue) => setDescription(newValue)}
          />
        </Form.Item>

        <Form.Item
          name="qty"
          label="Số lượng"
          rules={[{ type: 'number', min: 1, max: 1000, message: 'Số lượng phải lớn hơn 0, bé hơn 1000' }]}
        >
          <InputNumber className="w-full" placeholder="Nhập số lượng" />
        </Form.Item>

        <Typography.Title level={4}>Thông số</Typography.Title>
        {specifications.map((spec, specIndex) => (
          <div key={specIndex} className="border p-4 rounded mb-4">
            <Space direction="vertical" className="w-full">
              <Input
                placeholder="Tên nhóm thông số"
                value={spec.name}
                onChange={(e) => {
                  const newSpecs = [...specifications];
                  newSpecs[specIndex].name = e.target.value;
                  setSpecifications(newSpecs);
                }}
              />

              <Table
                dataSource={spec.attributes}
                columns={[
                  {
                    title: 'Thuộc tính',
                    dataIndex: 'name',
                    render: (text, record, index) => (
                      <Input
                        value={text}
                        onChange={(e) => {
                          const newSpecs = [...specifications];
                          newSpecs[specIndex].attributes[index].name = e.target.value;
                          setSpecifications(newSpecs);
                        }}
                      />
                    ),
                  },
                  {
                    title: 'Giá trị',
                    dataIndex: 'value',
                    render: (text, record, index) => (
                      <Input
                        value={text}
                        onChange={(e) => {
                          const newSpecs = [...specifications];
                          newSpecs[specIndex].attributes[index].value = e.target.value;
                          setSpecifications(newSpecs);
                        }}
                      />
                    ),
                  },
                  {
                    title: 'Hành động',
                    render: (_, record, index) => (
                      <Button
                        type="link"
                        onClick={() => {
                          const newSpecs = [...specifications];
                          newSpecs[specIndex].attributes.splice(index, 1);
                          setSpecifications(newSpecs);
                        }}
                      >
                        <MinusCircleOutlined />
                      </Button>
                    ),
                  },
                ]}
                rowKey={(record, index) => index}
                pagination={false}
              />
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => {
                  const newSpecs = [...specifications];
                  newSpecs[specIndex].attributes.push({ name: '', value: '' });
                  setSpecifications(newSpecs);
                }}
              >
                Thêm dòng
              </Button>
              <Button
                type="text"
                icon={<CloseOutlined />}
                className="text-red-500 mt-2"
                onClick={() => {
                  const newSpecs = specifications.filter((_, idx) => idx !== specIndex);
                  setSpecifications(newSpecs);
                }}
              >
                Xóa nhóm
              </Button>
            </Space>
          </div>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          className="mb-4"
          onClick={() => setSpecifications([...specifications, { name: '', attributes: [] }])}
        >
          Thêm nhóm thông số
        </Button>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu thay đổi</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SellerEditProduct;
