import { useState } from 'react'
import type { Conversation, Message } from '../types'
import { chatApi } from '../services/api'

export function useChat() {
	const [conversation, setConversation] = useState<Conversation | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const sendMessage = async (content: string) => {
		setIsLoading(true)
		setError(null)

		// 1. 乐观更新：立即显示用户消息
		const tempUserMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content,
			conversationId: conversation?.id || 'temp',
			createdAt: new Date(),
		}

		// 2. 占位符：创建一个空的 AI 消息用于流式接收
		const tempAssistantMessageId = (Date.now() + 1).toString()
		const tempAssistantMessage: Message = {
			id: tempAssistantMessageId,
			role: 'assistant',
			content: '', // 初始为空，即将开始打字
			conversationId: conversation?.id || 'temp',
			createdAt: new Date(),
		}

		setConversation((prev) => {
			if (!prev) return null // 理论上不会发生，因为下面会处理新会话逻辑
			return {
				...prev,
				messages: [...prev.messages, tempUserMessage, tempAssistantMessage],
			}
		})

		try {
			// 如果是新会话，我们需要先构造一个临时的 conversation 对象
			if (!conversation) {
				const tempConversation: Conversation = {
					id: 'temp', // 稍后会被真实 ID 替换
					title: '新会话',
					messages: [tempUserMessage, tempAssistantMessage],
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				setConversation(tempConversation)
			}

			// 3. 发起流式请求
			const response = await chatApi.sendMessageStream(
				{
					conversationId: conversation?.id,
					content,
				},
				(chunk) => {
					// 4. 实时更新：将收到的片段追加到最后一条消息
					setConversation((prev) => {
						if (!prev) return null
						const newMessages = [...prev.messages]
						const lastMsg = newMessages[newMessages.length - 1]

						// 确保我们是在更新正确的那条 AI 消息
						if (lastMsg.id === tempAssistantMessageId) {
							lastMsg.content += chunk
						}

						return { ...prev, messages: newMessages }
					})
				}
			)

			// 5. 完成：更新会话 ID 和完整状态
			// 注意：sendMessageStream 返回的 conversation 只有 ID 是准确的，messages 是空的
			// 所以我们需要保留当前已经流式生成的 messages
			setConversation((prev) => {
				if (!prev) return null
				return {
					...prev,
					id: response.conversationId, // 更新为真实 ID
					// messages 保持状态即可
				}
			})

			return response.message
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '发送消息失败'
			setError(errorMessage)

			// 发生错误时，移除临时的空消息，或者显示错误信息
			setConversation((prev) => {
				if (!prev) return null
				const msgs = [...prev.messages]
				if (msgs[msgs.length - 1].id === tempAssistantMessageId) {
					msgs.pop() // 移除失败的 AI 消息
				}
				return { ...prev, messages: msgs }
			})

			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const startNewConversation = () => {
		setConversation(null)
		setError(null)
	}

	return {
		conversation,
		isLoading,
		error,
		sendMessage,
		startNewConversation,
	}
}
