import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

function Message({ message }) {
  if (message.type === "image") {
    return <img src={message.content} alt="image message" />;
  } else if (message.type === "document") {
    let fileName = message.content.split("/").at(-1);
    return <a href={message.content} style={{
      display: "block",
      padding: "5px 14px",
      background: "#E2E8F0",
      borderRadius: "10px",
    }}><i className="fa fa-regular fa-file"></i> {fileName}</a>
  }
  return message.content;
}

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  messages = messages.flat();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#3EC7A8" : "#fff"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              }}
            >
              <Message message={m} />
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
