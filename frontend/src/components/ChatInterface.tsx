import { useEffect, useRef, useState, useMemo } from 'react'
import { useChat } from '../hooks/useChat'
import MessageBubble from './MessageBubble'
import InputBox from './InputBox'
import Toast from './Toast'
import ItineraryPanel from './ItineraryPanel'
import LoadingModal from './LoadingModal'
import './ChatInterface.css'

export default function ChatInterface() {
	const { conversation, isLoading, error, sendMessage, startNewConversation } =
		useChat()
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [showToast, setShowToast] = useState(false)

	// 自动滚动到底部
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [conversation?.messages])

	// 错误提示 - 显示toast
	useEffect(() => {
		if (error) {
			setShowToast(true)
		}
	}, [error])

	// 提取最新的行程内容（来自最后一条 AI 消息）
	const latestItineraryContent = useMemo(() => {
		if (!conversation) return ''
		// 倒序查找最后一条包含表格的 Assistant 消息
		const lastAiMsg = [...conversation.messages]
			.reverse()
			.find(
				(m) =>
					m.role === 'assistant' &&
					(m.content.includes('| 序号 |') || m.content.includes('|--'))
			)
		return lastAiMsg ? lastAiMsg.content : ''
	}, [conversation])

	const handleSendMessage = async (content: string) => {
		try {
			await sendMessage(content)
		} catch (err) {
			console.error('发送消息失败:', err)
		}
	}

	return (
		<div className='chat-layout'>
			<LoadingModal isOpen={isLoading} />
			{/* Left Panel: Glassmorphism Chat Area */}
			<div className='chat-container'>
				<header className='chat-header'>
					<div className='flex items-center gap-3'>
						<div className='text-2xl'>✈️</div>
						<div>
							<h1>智能旅游规划</h1>
							<p className='text-sm text-muted'>AI Travel Companion</p>
						</div>
					</div>
					{conversation && (
						<button onClick={startNewConversation} className='new-chat-btn'>
							<span className='text-lg'>+</span> 新对话
						</button>
					)}
				</header>

				<div className='messages-area'>
					{!conversation ? (
						<div className='flex flex-col items-center justify-center h-full text-center p-8 opacity-0 animate-fade-in'>
							<div className='text-6xl mb-6 animate-slide-up'>🌍</div>
							<h2 className='mb-2'>开启您的梦幻旅程</h2>
							<p className='text-muted mb-8 max-w-md'>
								告诉我您的目的地、时间和预算，为您生成包含真实景点、美食和酒店的完美行程。
							</p>
							<div className='flex flex-wrap justify-center gap-3'>
								<button
									onClick={() => handleSendMessage('我想去日本京都旅游5天')}
									className='btn btn-secondary glass-card px-6 py-3 hover:bg-white'
								>
									🌸 京都赏樱 5日游
								</button>
								<button
									onClick={() =>
										handleSendMessage('帮我规划上海周末游，预算3000元')
									}
									className='btn btn-secondary glass-card px-6 py-3 hover:bg-white'
								>
									🏙️ 上海周末 Citywalk
								</button>
							</div>
						</div>
					) : (
						<>
							{conversation.messages.map((message) => (
								<MessageBubble key={message.id} message={message} />
							))}
							<div ref={messagesEndRef} />
						</>
					)}
				</div>

				<div className='input-area'>
					<InputBox
						onSend={handleSendMessage}
						disabled={isLoading}
						placeholder={
							conversation ? '继续规划您的行程...' : '例如：下周去三亚玩4天...'
						}
					/>
				</div>
			</div>

			{/* Right Panel: Map & Itinerary */}
			<div className='map-panel'>
				<ItineraryPanel
					content={latestItineraryContent}
					loading={isLoading && !latestItineraryContent}
				/>
			</div>

			{/* Toast Notification */}
			{showToast && error && (
				<Toast
					message={error}
					type='error'
					onClose={() => setShowToast(false)}
				/>
			)}
		</div>
	)
}
