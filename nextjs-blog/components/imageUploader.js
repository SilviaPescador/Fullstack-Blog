import { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }) => {
	const [selectedImage, setSelectedImage] = useState(null);

	const onDrop = (acceptedFiles) => {
		const file = new File(acceptedFiles, acceptedFiles[0].name);
		setSelectedImage(URL.createObjectURL(file));
		onImageUpload(file);
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} className="border border-dark card shadow p-4">
			<input {...getInputProps()} />
			{selectedImage ? (
				<img src={selectedImage} alt="Selected" />
			) : (
				<div className="text-center text-muted">
					Drop your pic here, or clic to select one
				</div>
			)}
		</div>
	);
};

export default ImageUploader;
