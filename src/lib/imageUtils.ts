export async function encodeImage(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const base64String = reader.result?.toString().split(',')[1] || '';
			resolve(base64String);
		};

		reader.onerror = (error) => reject(error);

		reader.readAsDataURL(file);
	});
}
