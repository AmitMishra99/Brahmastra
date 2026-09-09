import { useEffect } from "react";
import ChatInput from "./ChatArea/ChatInput";
import MessageList from "./ChatArea/MessageList";
import Nav from "./ChatArea/Nav";
import { getMessages } from "../apis/getMessages";
import { useDispatch, useSelector } from "react-redux";
import { addMessages } from "../../redux/messageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  console.log(selectedConversation?._id);

  useEffect(() => {
    const getMessagesList = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id);
        console.log(data);
        dispatch(addMessages(data));
      }
    };
    getMessagesList();
  }, [selectedConversation]);

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
