const ChatList = () => {
  return (
    <div class="chatList flex-1 overflow-y-scroll">
      <div class="flex sticky top-0 bg-white items-center gap-5 p-5">
        <div class=" flex-1 bg-[#ffffff] flex items-center gap-5 rounded-xl p-[2,1,1,1] border-2 border-[#e0e6eb]">
          <img src="./search.png" alt="" class="w-5 h-5 pl-2 pt-1 pb-1" />
          <input
            type="text"
            placeholder="Search Contacts"
            class="text-black bg-transparent border-none outline-none flex-1"
          />
        </div>
      </div>
      <div class="flex items-center gap-1 pl-4">
        Recent chats
        <img src="./down.png" alt="" class="w-5 h-5 cursor-pointer" />
      </div>
      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>

      <div class="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-[#e0e6eb]">
        <img src="avatar.png" alt="" class="w-10 h-10 rounded-full" />
        <div class="text">
          <span>Jane Doe</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
