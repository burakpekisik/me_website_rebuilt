import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled, { css, keyframes } from "styled-components";

// Styled components for animation
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin: 20px auto;
  max-width: 400px;
  border-radius: 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #888;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 8px;
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  animation: ${(props) =>
    props.isDeleting
      ? css`
          ${fadeOut} 0.3s ease-out
        `
      : css`
          ${fadeIn} 0.3s ease-out
        `};
`;

const DeleteButton = styled.button`
  width: 100%;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  margin-top: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darkred;
  }
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Hover effect to scale the image */
  }
`;

// Modal components for preview with animation
const PreviewModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    background-color: #cc0000;
  }
`;

const PhotoUploader = ({
  images = [],
  isDropzoneActive,
  isDeleteButtonActive,
  orderId,
  token,
}) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); // For preview image
  const [isImageDeleting, setIsImageDeleting] = useState(false); // For delete animation

  useEffect(() => {
    setUploadedImages(images);
  }, [images]);

  const handleDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("order_id", orderId);

    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/photo/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: { order_id: orderId },
      });

      const newImages = response.data.photos.map((photo) => ({
        url: `${BASE_URL}/${photo.path}`,
        id: photo.path.split("/").pop(),
        path: photo.path,
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const handleRemoveImage = async (id, path) => {
    setIsImageDeleting(true); // Trigger delete animation

    try {
      const photoName = path.split("/").pop();
      await axios.delete(`${BASE_URL}/photos/${orderId}/${photoName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUploadedImages((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setIsImageDeleting(false); // Stop delete animation
    }
  };

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl); // Show preview image
  };

  const closePreview = () => {
    setPreviewImage(null); // Close preview image
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop,
  });

  return (
    <div>
      {isDropzoneActive && (
        <DropZone {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Fotoğraflarınızı buraya sürükleyin ya da tıklayıp yükleyin</p>
        </DropZone>
      )}

      {uploadedImages.length > 0 && (
        <ImageGallery>
          {uploadedImages.map((image) => (
            <ImageContainer key={image.id} isDeleting={isImageDeleting}>
              <UploadedImage
                src={image.url}
                alt={image.id}
                onClick={() => handleImagePreview(image.url)} // Handle click to show preview
              />
              {isDeleteButtonActive && (
                <DeleteButton
                  onClick={() => handleRemoveImage(image.id, image.path)}
                >
                  Sil
                </DeleteButton>
              )}
            </ImageContainer>
          ))}
        </ImageGallery>
      )}

      {/* Preview modal */}
      {previewImage && (
        <PreviewModal>
          <PreviewImage src={previewImage} alt="Preview" />
          <CloseButton onClick={closePreview}>×</CloseButton>
        </PreviewModal>
      )}
    </div>
  );
};

export default PhotoUploader;
