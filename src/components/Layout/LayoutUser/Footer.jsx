import React from 'react';

const Footer = () => {
  const policies = [
    "Chính sách bảo mật",
    "Chính sách đổi trả",
    "Chính sách vận chuyển",
    "Chính sách trả hàng hoàn tiền"
  ];

  return (
    <footer className="w-full bg-white mt-8 border-t">
      {/* Policy Links */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          {policies.map((policy, index) => (
            <button
              key={index}
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              {policy}
            </button>
          ))}
        </div>

        {/*Information */}
        <div className="text-xs text-gray-500 leading-relaxed text-center">
          <p className="mb-2">
            © Group 07 - 3KaToẾch - Nhập môn công nghệ phần mềm
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;