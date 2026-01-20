import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'

export interface Location {
	name: string
	address: string
	lat?: number
	lng?: number
}

export interface GeoCodeResult {
	name: string
	address: string
	location: string // "经度,纬度"
	lat: number
	lng: number
}

@Injectable()
export class AmapService {
	private readonly logger = new Logger(AmapService.name)
	private readonly apiKey: string
	private readonly client: AxiosInstance

	constructor(private configService: ConfigService) {
		const apiKey = this.configService.get<string>('AMAP_WEB_API_KEY')

		if (!apiKey) {
			throw new Error(
				'未配置 AMAP_WEB_API_KEY，请在 .env 文件中设置高德地图 Web 服务 API Key',
			)
		}

		this.apiKey = apiKey

		// 创建 Axios 实例
		this.client = axios.create({
			baseURL: 'https://restapi.amap.com',
			timeout: 10000,
		})

		this.logger.log(`🗺️ 高德地图服务已初始化`)
	}

	/**
	 * 地理编码：将地址转换为经纬度
	 */
	async geocode(address: string, city?: string): Promise<GeoCodeResult | null> {
		try {
			const params: any = {
				key: this.apiKey,
				address: address,
			}
			if (city) {
				params.city = city
			}

			const response = await this.client.get('/v3/geocode/geo', {
				params,
			})

			if (response.data.status === '1' && response.data.geocodes?.length > 0) {
				const result = response.data.geocodes[0]
				const [lng, lat] = result.location.split(',').map(Number)

				this.logger.debug(
					`地理编码成功: ${address} ${city || ''} -> ${result.location}`,
				)

				return {
					name: result.formatted_address || address,
					address: result.formatted_address || address,
					location: result.location,
					lat,
					lng,
				}
			}

			this.logger.warn(`地理编码失败: ${address} (city: ${city})，未找到结果`)
			return null
		} catch (error) {
			this.logger.error(`地理编码API调用失败: ${address}`, error)
			throw new Error(`地理编码失败: ${error.message}`)
		}
	}

	/**
	 * 关键字搜索 (Place Text Search)
	 * 比地理编码更宽容，适合模糊查询
	 */
	async textSearch(
		keyword: string,
		city?: string,
	): Promise<GeoCodeResult | null> {
		try {
			const params: any = {
				key: this.apiKey,
				keywords: keyword,
				citylimit: !!city,
				output: 'json',
				offset: 1, // 只取第一个最匹配的
				page: 1,
				extensions: 'base',
			}
			if (city) {
				params.city = city
			}

			const response = await this.client.get('/v3/place/text', { params })

			if (response.data.status === '1' && response.data.pois?.length > 0) {
				const poi = response.data.pois[0]
				const [lng, lat] = poi.location.split(',').map(Number)

				return {
					name: poi.name,
					address: poi.address || poi.name,
					location: poi.location,
					lat,
					lng,
				}
			}
			return null
		} catch (error) {
			this.logger.error(`关键字搜索失败: ${keyword}`, error)
			return null
		}
	}

	/**
	 * 批量地理编码
	 */
	async batchGeocode(
		locations: Location[],
		city?: string,
	): Promise<GeoCodeResult[]> {
		const results: GeoCodeResult[] = []

		for (const location of locations) {
			// 如果已有经纬度，跳过
			if (location.lat && location.lng) {
				results.push({
					name: location.name,
					address: location.address,
					location: `${location.lng},${location.lat}`,
					lat: location.lat,
					lng: location.lng,
				})
				continue
			}

			// 1. 预先检查名称是否有效（过滤时长、纯数字等）
			const isInvalidName = (str: string) => {
				if (!str) return true
				// 过滤时长 (e.g., "60分钟", "1小时", "2h")
				if (/^[\d\.]+\s*(分钟|min|h|小时|hours?)$/i.test(str)) return true
				// 过滤纯数字
				if (/^\d+$/.test(str)) return true
				// 过滤短的无意义词
				if (str.length < 2 && !['塔', '寺', '山'].some((s) => str.includes(s)))
					return true
				return false
			}

			if (isInvalidName(location.address) && isInvalidName(location.name)) {
				this.logger.warn(`跳过无效地点: ${location.name} ${location.address}`)
				continue
			}

			// 2. 尝试使用地址进行地理编码
			let result: GeoCodeResult | null = null

			// [Multi-City Fix] 如果地址中包含明确的城市名（如“厦门市”），则优先使用地址中的城市，或者不传 global city 以避免冲突
			let targetCity = city
			const cityMatch = location.address.match(/([\u4e00-\u9fa5]{2,5})市/)
			if (cityMatch) {
				// 如果地址里明确写了某某市，就以此为准（或者干脆不传city让AMap自己解析）
				// AMap Geocode API 如果 address="福建省厦门市..." 且 city="漳州"，可能会报错或找不到。
				// 所以如果检测到地址有“市”，我们清除 city 参数，让 API 全局匹配地址
				targetCity = undefined
				// 也可以设定为 cityMatch[0], 但 undefined 对完整地址更安全
			}

			if (!isInvalidName(location.address)) {
				try {
					result = await this.geocode(location.address, targetCity)
				} catch (err) {
					this.logger.warn(
						`精准地理编码异常 (将尝试关键字搜索): ${location.address} - ${err.message}`,
					)
					result = null
				}
			}

			if (result) {
				results.push({
					...result,
					name: location.name,
				})
			} else {
				// 4. [Search Strategy] 如果精准地理编码全失败，尝试使用“关键字搜索”(Place Text Search)
				this.logger.log(
					`精准地理编码失败，尝试使用关键字搜索(Place Search): ${location.name} in ${city}`,
				)
				// 4.1 首先尝试用原始name搜索
				let searchResult = await this.textSearch(location.name, city)

				// 4.2 如果name包含无意义前缀（如"前往"、"返回"），清洗后再试
				if (!searchResult) {
					const cleanedName = location.name
						.replace(/^(前往|返回|去|到|游览|参观)\s*/g, '')
						.replace(/(酒店|车站|机场)$/g, '')
						.trim()

					if (cleanedName && cleanedName !== location.name) {
						this.logger.log(
							`尝试使用清洗后的关键字: "${cleanedName}" (原: "${location.name}")`,
						)
						searchResult = await this.textSearch(cleanedName, city)
					}
				}

				// 4.3 如果address包含详细地址，提取关键部分再试
				if (!searchResult && location.address) {
					const addressKeywords = location.address
						.replace(/^.*(省|市|区|县|镇|乡|街道)/g, '')
						.replace(/\d+号.*$/g, '')
						.trim()

					if (addressKeywords && addressKeywords.length > 2) {
						this.logger.log(`尝试使用地址关键词: "${addressKeywords}"`)
						searchResult = await this.textSearch(addressKeywords, city)
					}
				}

				// 4.4 如果还是失败，尝试不限制城市搜索
				if (!searchResult && city) {
					this.logger.log(
						`城市限定搜索失败，尝试全国范围搜索: "${location.name}"`,
					)
					searchResult = await this.textSearch(location.name, undefined)
				}

				if (searchResult) {
					results.push({
						...searchResult,
						name: location.name,
					})
					this.logger.log(
						`关键字搜索成功: ${location.name} -> ${searchResult.location}`,
					)
				} else {
					this.logger.warn(
						`无法获取地址坐标 (All methods failed): ${location.name} - ${location.address}`,
					)
				}
			}

			// 避免频繁调用API
			await this.delay(200)
		}

		return results
	}

	/**
	 * 生成静态地图图片URL
	 */
	generateStaticMapUrl(
		locations: GeoCodeResult[],
		options?: {
			width?: number
			height?: number
			zoom?: number
		},
	): string {
		const { width = 800, height = 600, zoom = 13 } = options || {}

		// 构建markers参数（标记点）
		const markers = locations
			.map((loc, index) => {
				// 格式：经度,纬度
				return `${loc.lng},${loc.lat}`
			})
			.join('|')

		// 构建路径参数（连接线）
		const paths = locations.map((loc) => `${loc.lng},${loc.lat}`).join(';')

		// 计算中心点（使用第一个点）
		const center =
			locations.length > 0
				? `${locations[0].lng},${locations[0].lat}`
				: '116.397428,39.90923' // 默认北京

		const url = new URL('https://restapi.amap.com/v3/staticmap')
		url.searchParams.append('key', this.apiKey)
		url.searchParams.append('size', `${width}*${height}`)
		url.searchParams.append('zoom', zoom.toString())
		url.searchParams.append('center', center)

		// 添加标记（红色标记）
		if (markers) {
			url.searchParams.append(
				'markers',
				`-1,https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png,0:${markers}`,
			)
		}

		// 添加路径（蓝色线条）
		if (paths) {
			url.searchParams.append('paths', `10,0x0000FF,1,,:${paths}`)
		}

		this.logger.debug(`生成静态地图URL，点数: ${locations.length}`)
		return url.toString()
	}

	/**
	 * 延迟函数
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}
