import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "../ui/card";

export const RichTextEditor = ({ value, onChange }) => {
    const quillRef = useRef(null);

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "bold",
        "link",
        "image",
    ];

    return (
        <Card className="w-full shadow-md rounded-lg border border-gray-200 bg-white">
            <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Nội dung</h3>
                    <p className="text-sm text-gray-500">
                        Chỉnh sửa nội dung với trình soạn thảo văn bản.
                    </p>
                </div>

                {/* Rich Text Editor */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <ReactQuill
                        ref={quillRef}
                        value={value}
                        onChange={onChange}
                        modules={modules}
                        formats={formats}
                        theme="snow"
                        style={{
                            minHeight: '400px', 
                            height: '500px',
                        }}
                        className="flex flex-col"
                    />
                </div>
            </div>
        </Card>
    );
};
