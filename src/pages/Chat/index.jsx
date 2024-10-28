import Chat from "../../components/chat/chat";
import List from "../../components/list/list";
import Footer from "../../components/layout/layoutUser/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "../../components/layout/layoutUser/Header";

function ChatPage() {
  return (
    <>
      <div>
        {/* Header */}
        <div>
          <Header />
        </div>
        {/* Main Content */}
        <div className="w-full h-[40rem]">
          <div className="flex justify-center items-center w-full h-full px-40 py-5 bg-[#f4f7fb]">
            <div className="flex w-full h-full bg-white rounded-2xl">
              <List />
              <Chat />
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default ChatPage;
