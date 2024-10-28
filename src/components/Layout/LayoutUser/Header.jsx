import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../images/logo.png";
function Header() {
  const isLogin = false;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    if (category) {
      setSearchQuery(`Tìm trong ${category}`);
    }
  }, [category]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleClickLogo = () => {
    setSearchQuery("");
    navigate("/");
  };

  return (
    <>
      <header className="w-full bg-white px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
          {/* Wrapper for logo and text */}
          <div className="flex flex-col items-center sm:items-start">
            {/* Logo và văn bản */}
            <div className="w-12 h-12 flex items-center space-x-2">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover hover:cursor-pointer mr-3"
                onClick={handleClickLogo} // Chuyển đến trang chủ khi nhấn vào logo
              />
              <p className="font-bold text-lg text-2xl">Chat</p>
            </div>
          </div>

          {/* Conditional Rendering for User Login */}
          {isLogin ? (
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <div className="relative">
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <ShoppingCartOutlined
                    style={{ fontSize: "20px", marginRight: "12px" }}
                  />
                  Giỏ hàng
                </button>
                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="relative">
                <BellOutlined
                  style={{ fontSize: "20px", marginRight: "6px" }}
                />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <UserOutlined
                  style={{ fontSize: "20px", marginRight: "8px" }}
                />
                Khanhpro
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <div className="relative">
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <ShoppingCartOutlined
                    style={{ fontSize: "20px", marginRight: "12px" }}
                  />
                  Giỏ hàng
                </button>
                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
