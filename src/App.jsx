import Chat from "./components/chat/chat";
import "./index.css";
import List from "./components/list/list";
import Header from "./components/LayoutUser/Header";
import Footer from "./components/LayoutUser/Footer";

const App = () => {
  return (
    <>
      <div>
        <div class="h-20">Header</div>
        <div className="w-full h-[40rem]">
          <div className="flex justify-center items-center w-full h-full px-40 py-5 bg-[#f4f7fb] ">
            <div className="flex w-full h-full bg-white rounded-2xl">
              <List />
              <Chat />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;