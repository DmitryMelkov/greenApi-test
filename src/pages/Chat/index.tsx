import { useNavigate } from 'react-router-dom'
import { clearCredentials } from '@/lib/credentials'
import type { Credentials } from '@/types/chat'
import { Toast } from '@/ui/Toast'
import { ChatList } from './components/ChatList'
import { ChatWindow } from './components/ChatWindow'
import { NewChatModal } from './components/NewChatModal'
import { useChatPage } from './hooks'
import styles from './Chat.module.css'

interface ChatPageProps {
  credentials: Credentials
}

export const ChatPage = ({ credentials }: ChatPageProps) => {
  const navigate = useNavigate()
  const {
    state,
    activeChat,
    activeMessages,
    selectChat,
    openNewChat,
    closeNewChat,
    createChat,
    sendText,
    clearToast,
  } = useChatPage(credentials)

  const onLogout = () => {
    clearCredentials()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.layout}>
      <ChatList
        chats={state.chats}
        activeChatId={state.activeChatId}
        onSelect={selectChat}
        onNewChat={openNewChat}
        onLogout={onLogout}
      />
      <ChatWindow
        chat={activeChat}
        messages={activeMessages}
        isSending={state.isSending}
        onSend={sendText}
      />
      <NewChatModal
        isOpen={state.isNewChatOpen}
        isSubmitting={state.isCreatingChat}
        onClose={closeNewChat}
        onSubmit={createChat}
      />
      <Toast toast={state.toast} onClose={clearToast} />
    </div>
  )
}
