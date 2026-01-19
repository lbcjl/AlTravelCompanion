import { Tool } from '@langchain/core/tools'
import axios from 'axios'

export class TavilyTool extends Tool {
	name = 'tavily_search'
	description =
		'Use this tool to search for real-time travel information on the internet.'

	private apiKey: string

	constructor(apiKey: string) {
		super()
		this.apiKey = apiKey
	}

	/** @ignore */
	async _call(query: string): Promise<string> {
		try {
			const response = await axios.post(
				'https://api.tavily.com/search',
				{
					api_key: this.apiKey,
					query,
					search_depth: 'basic',
					include_answer: true,
					max_results: 5,
				},
				{
					timeout: 10000,
				},
			)

			const results = response.data.results || []
			const answer = response.data.answer || ''

			// 格式化输出
			const formattedResults = results
				.map((r: any) => `[${r.title}](${r.url})\n${r.content}`)
				.join('\n\n')

			return answer
				? `AI Summary: ${answer}\n\nSources:\n${formattedResults}`
				: formattedResults
		} catch (error) {
			console.error('Tavily Search Error:', error.message)
			if (error.response?.data) {
				console.error('Tavily API Error Details:', error.response.data)
			}
			throw new Error(`Tavily search failed: ${error.message}`)
		}
	}
}
