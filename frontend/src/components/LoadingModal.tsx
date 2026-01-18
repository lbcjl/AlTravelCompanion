import './LoadingModal.css'

interface LoadingModalProps {
	isOpen: boolean
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
	if (!isOpen) return null

	return (
		<div className='loading-modal-overlay'>
			<div className='loading-modal-content'>
				<div className='plane-animation'>
					<div className='plane'>✈️</div>
					<div className='cloud cloud-1'>☁️</div>
					<div className='cloud cloud-2'>☁️</div>
				</div>
				<p>AI 正在为您定制专属行程...</p>
			</div>
		</div>
	)
}
