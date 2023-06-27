import { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(URL.createObjectURL(file));
    onImageUpload(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="shadow p-4">
      <input {...getInputProps()} />
      {selectedImage ? (
        <img src={selectedImage} alt="Selected" />
      ) : (
        <div className="">Arrastra y suelta una imagen aquí, o haz clic para seleccionarla</div>
      )}
    </div>
  );
};

export default ImageUploader;