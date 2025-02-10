import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled, { keyframes } from "styled-components";

// Animasyon tanımları
const scaleIn = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const DropZone = styled.div`
  border: 2px dashed #4caf50;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin: 20px auto;
  max-width: 400px;
  border-radius: 8px;
  background-color: #f0f8f0;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e8f5e9;
    border-color: #2e7d32;
  }
`;

const FileGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 2px solid #4caf50;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${scaleIn} 0.3s ease-out;
`;

const FileIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 10px;
  font-weight: bold;
`;

const FileRemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const FileDetails = styled.div`
  text-align: center;
  max-width: 100%;
  overflow: hidden;
`;

const FileNameTruncated = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin: 5px 0;
`;

const FileUploader = ({
  files,
  isDropzoneActive,
  isDeleteButtonActive,
  orderId,
  token,
}) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [uploadedFiles, setUploadedFiles] = useState(files);

  useEffect(() => {
    setUploadedFiles(files);
  }, [files]);

  const handleDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("order_id", orderId);

    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/file?order_id=${orderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newFiles = response.data.files.map((file) => ({
        url: `${BASE_URL}/${file.path}`,
        id: file.path.split("/").pop(),
        path: file.path,
        name: file.path.split("/").pop(),
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleRemoveFile = async (id, path) => {
    try {
      const fileName = path.split("/").pop();
      await axios.delete(`${BASE_URL}/files/${orderId}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleFilePreview = (filePath) => {
    if (filePath.endsWith(".pdf")) {
      window.open(`${BASE_URL}/${filePath}`, "_blank"); // Open in a new tab
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    onDrop: handleDrop,
  });

  const getFileExtensionIcon = (fileName) => {
    const extension = fileName.split(".").pop().toUpperCase();
    switch (extension) {
      case "PDF":
        return "PDF";
      case "DOCX":
      case "DOC":
        return "DOC";
      case "XLSX":
      case "XLS":
        return "XLS";
      default:
        return "FILE";
    }
  };

  return (
    <div>
      {isDropzoneActive && (
        <DropZone {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            PDF, Word ve Excel dosyalarınızı buraya sürükleyin ya da tıklayın
          </p>
        </DropZone>
      )}

      {uploadedFiles.length > 0 && (
        <FileGallery>
          {uploadedFiles.map((file) => (
            <FileContainer key={file.id}>
              <FileIcon>{getFileExtensionIcon(file.name)}</FileIcon>
              <FileDetails>
                <FileNameTruncated>{file.name}</FileNameTruncated>
                {isDeleteButtonActive && (
                  <FileRemoveButton
                    onClick={() => handleRemoveFile(file.id, file.path)}
                  >
                    Sil
                  </FileRemoveButton>
                )}
                {/* Make PDF files clickable to open in a new tab */}
                {file.name.endsWith(".pdf") && (
                  <FileRemoveButton
                    onClick={() => handleFilePreview(file.path)}
                    style={{ backgroundColor: "#4CAF50", marginLeft: "10px" }}
                  >
                    Görüntüle
                  </FileRemoveButton>
                )}
              </FileDetails>
            </FileContainer>
          ))}
        </FileGallery>
      )}
    </div>
  );
};

export default FileUploader;
