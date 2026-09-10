import { useEffect } from "react";
import ChatInput from "./ChatArea/ChatInput";
import MessageList from "./ChatArea/MessageList";
import Nav from "./ChatArea/Nav";
import { getMessages } from "../apis/getMessages";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessagesList = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMessagesList();
  }, [selectedConversation]);

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <MessageList />
      { selectedConversation && <ChatInput/>}
    </div>
  );
};

export default ChatArea;
