
// live capture the color by camera

const CAPTURE_SIZE = { WIDTH: 720, HEIGHT: 720 };

export async function liveCapture(cameraVideo, focusedColorEl) {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: {
			facingMode: "environment",
			width: CAPTURE_SIZE.WIDTH,
			height: CAPTURE_SIZE.HEIGHT
		},
		audio: false
	});

	focusedColorEl.addEventListener('click', () => {
		stream.getTracks().forEach(track => track.stop());
	});
	
	const colorReader = new ColorReader(cameraVideo, focusedColorEl);
	cameraVideo.srcObject = stream;
	cameraVideo.play();
}

class ColorReader {
	_started = false;
	_dx = 0;
	_dy = 0;
	constructor(video, elementToPreview) {
		this.video = video;
		this.elementToPreview = elementToPreview;
		this.canvas = document.createElement('canvas');
		this.canvas.width = 1;
		this.canvas.height = 1;
		this.context = this.canvas.getContext('2d');

		this.video.addEventListener('playing', () => {
			// Offset video on canvas to get the center pixel
			this._dx = -this.video.videoWidth / 2 | 0;
			this._dy = -this.video.videoHeight / 2 | 0;
			this._start();
		});
		this.video.addEventListener('pause', () => {
			this._stop();
		});
	}

	_readVideoCenterPixel() {
		const { video, _dx, _dy } = this;
		this.context.drawImage(video, _dx, _dy);
		const imageData = this.context.getImageData(0, 0, 1, 1);
		const [r, g, b] = imageData.data;
		return [r, g, b];
	}

	_previewPixel() {
		const pixel = this._readVideoCenterPixel();
		const color = `#${pixel.map(c => c.toString(16).padStart(2, '0')).join('')}`;
		this.elementToPreview.style.backgroundColor = color;
	}

	_start() {
		this._started = true;
		const frame = () => {
			if (!this._started) return;
			this._previewPixel();
			requestAnimationFrame(frame);
		};
		frame();
	}

	_stop() {
		this._started = false;
	}
}
