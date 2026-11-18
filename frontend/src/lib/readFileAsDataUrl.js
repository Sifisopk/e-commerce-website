const MAX_SIDE = 1600; // longest side in pixels after shrinking
const SMALL_FILE = 1.5 * 1024 * 1024; // smaller photos are sent exactly as they are

const readRaw = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});

const loadImage = (src) =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});

// Turns a chosen photo into a data URL. Big phone photos are shrunk first so saving stays fast.
export const readFileAsDataUrl = async (file) => {
	const raw = await readRaw(file);
	if (file.size <= SMALL_FILE) return raw;

	try {
		const img = await loadImage(raw);
		const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.round(img.width * scale);
		canvas.height = Math.round(img.height * scale);
		canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", 0.85);
	} catch (error) {
		return raw;
	}
};
