import React from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const downloadJSON = (data) => {
    const fileName = 'analytics_data.json';
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

const downloadCSV = (categories) => {
    if (!categories || categories.length === 0) return;

    const fileName = 'analytics_categories_detailed.csv';

    // Dynamically extract all keys for headers
    const headers = [
        'Category ID',
        'Category Name',
        'Total Sales (VND)',
        'Percentage of Total Revenue',
    ];

    const rows = categories.map((category) => [
        category.category_id,
        category.category_name || 'Unknown',
        parseInt(category.total_sales).toLocaleString('vi-VN'),
        `${((parseInt(category.total_sales) / categories.reduce((sum, cat) => sum + parseInt(cat.total_sales), 0)) * 100).toFixed(1)}%`,
    ]);

    // Combine headers and rows into CSV content
    const csvContent = `\uFEFF${[headers.join(','), ...rows.map(row => row.join(','))].join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

export const ExportButtons = ({ analytics }) => (
    <Space>
        <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadJSON(analytics)}
            disabled={!analytics}
        >
            Export as JSON
        </Button>
        <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadCSV(analytics.categories)}
            disabled={!analytics || !analytics.categories.length}
        >
            Export as Detailed CSV
        </Button>
    </Space>
);