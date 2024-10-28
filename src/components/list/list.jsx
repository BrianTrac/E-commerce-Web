import ChatList from "./chatList/ChatList";
import React from "react";
import UserInfo from "./userInfo/UserInfo";

function List() {
  return (
    <div className="flex-1 flex flex-col h-full rounded-2xl">
      <UserInfo />
      <ChatList />
    </div>
  );
}

export default List;
