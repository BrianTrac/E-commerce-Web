import "../../index.css";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";

function Chat() {
  const [chosenEmoji, setChosenEmoji] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (e, emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setChosenEmoji(false);
    console.log(emojiObject);
  };

  return (
    <div className="chat flex-2 border-l-2 flex flex-col">
      <div className="top p-5 flex items-center justify-between border-b-2">
        <div className="user flex items-center gap-5">
          <img
            src="avatar.png"
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="texts flex gap-1 flex-col">
            <span className="size-4 font-bold whitespace-nowrap">Jane Doe</span>
            <p className="text-sm from-neutral-300 text-[#a5a5a5]">Online</p>
          </div>
        </div>
      </div>

      <div className="center overflow-y-scroll flex-1 p-5 flex flex-col gap-5">
      <div className="message max-w-[70%] flex gap-5">
          <img src="avatar.png" alt="" className="w-7 h-7 rounded-full" />
          <div className="text">
            <p class="p-5 rounded-xl bg-[#e0e6eb]">
              There's something about stepping out of your
              routine that can really recharge your energy.
            </p>
            <span class="text-xs">1 minute ago</span>
          </div>
        </div>

        <div className="message own max-w-[70%] self-end ">
          <div className="text flex-col flex flex-1">
            <p class="bg-blue-500 p-5 rounded-xl">
              I think it might be time for a change of scenery, even if it's
              just a short trip. There's something about stepping out of your
              routine that can really recharge your energy.
            </p>
            <span class="text-xs">1 minute ago</span>
          </div>
        </div>

        <div className="message max-w-[70%] flex gap-5">
          <img src="avatar.png" alt="" className="w-7 h-7 rounded-full" />
          <div className="text">
            <p class="p-5 rounded-xl bg-[#e0e6eb]">
              Hey, have you ever thought about taking a break and traveling
              somewhere new? I've been feeling so overwhelmed with work lately.
              I think it might be time for a change of scenery, even if it's
              just a short trip. There's something about stepping out of your
              routine that can really recharge your energy.
            </p>
            <span class="text-xs">1 minute ago</span>
          </div>
        </div>

        <div className="message own max-w-[70%] self-end ">
          <div className="text flex-col flex flex-1">
            <img src="imageChatjpg.jpg" alt="" className="w-full h-full rounded-xl mb-1" />
            <p class="bg-blue-500 p-5 rounded-xl">
              Hey, have you ever thought about taking a break and traveling
              somewhere new? I've been feeling so overwhelmed with work lately.
              I think it might be time for a change of scenery, even if it's
              just a short trip. There's something about stepping out of your
              routine that can really recharge your energy.
            </p>
            <span class="text-xs">1 minute ago</span>
          </div>
        </div>
      </div>

      <div className="bottom p-5 flex border-t-2 mt-auto">
        <button className="sendButton bg-[#e0e6eb] p-[10,20,0,0] rounded-lg cursor-pointer mr-2">
          <img src="picture.png" alt="" className="w-9 h-9 ml-1 mr-1" />
        </button>

        <div className="emoji bg-[#e0e6eb] p-2 rounded-lg cursor-pointer mr-2 relative">
          <img
            src="emoji.png"
            className="w-7 h-7"
            alt=""
            onClick={() => setChosenEmoji((prev) => !prev)}
          />
          {chosenEmoji && (
            <div className="picker absolute bottom-12 left-0">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-xl border-2 border-[#e0e6eb] p-2"
        />

        <button className="sendButton bg-[#e0e6eb] p-[10,20,0,0] rounded-lg cursor-pointer ml-2">
          <img src="send.png" alt="" className="w-6 h-6 ml-3 mr-3" />
        </button>
      </div>
    </div>
  );
}

export default Chat;