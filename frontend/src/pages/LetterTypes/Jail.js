import axios from "axios";
import { StepperWithContent } from "components/stepper/Stepper.js";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone"; // Fotoğraf yüklemek için react-dropzone
import Modal from "react-modal"; // Modal için react-modal kütüphanesi
import ReactQuill from "react-quill"; // Text editor için react-quill kütüphanesi
import "react-quill/dist/quill.snow.css"; // react-quill teması
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select"; // Dropdown menüler için react-select kütüphanesi
import styled from "styled-components";
import Header from "../../components/headers/light.js";
import FileUploader from "./FileUploader.js";
import PhotoUploader from "./PhotoUploader.js";


Modal.setAppElement("#root");

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const DropdownRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const DropdownColumn = styled.div`
  min-width: 0;
`;

const ColorLabel = styled.h2`
  color: ${(props) => (props.color === "#FFFFFF" ? "#000000" : props.color)};
  font-size: 1rem;
  margin-bottom: 8px;
`;

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 21cm;
  min-height: 29.7cm;
  padding: 2cm;
  background-color: ${(props) => props.paperColor || "white"};
  border: 1px solid #ccc;
  margin: 20px auto;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  page-break-after: always;
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
`;

const DeleteButton = styled.button`
  width: 100%; // Make the button's width match the container
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  margin-top: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const AddButton = styled.button`
  width: 100%; // Make the button's width match the container
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  padding: 5px 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darkgreen; // Darker shade on hover
  }
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
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

const ActionButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

const TextContent = styled.div`
  font-size: 12pt;
  font-family: Arial, sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ContinueButton = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: #2563eb; /* Tailwind'in blue-600 rengi */
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  transform: scale(1);

  &:hover {
    background-color: #1e40af; /* Tailwind'in blue-700 rengi */
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Butonu sağa yaslamak için eklenmiştir */
  margin: 20px 0;
`;

// Add new styled components for selected cardpostals
const SelectedCardpostalsGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const SelectedCardpostalContainer = styled(ImageContainer)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 8px;
  border-radius: 8px;
`;

const SelectedCardpostalImage = styled(UploadedImage)`
  border: 2px solid #4CAF50;
`;

const RemoveButton = styled(DeleteButton)`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
`;

const SectionTitle = styled.h3`
  color: #333;
  margin: 20px 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ImagePreviewModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  outline: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 100px);
  object-fit: contain;
`;

const ClosePreviewButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &:hover {
    background-color: #cc0000;
  }
`;

const dateOptions = [
  { value: "Mektuba Tarih Eklensin", label: "Mektuba Tarih Eklensin" },
  { value: "Mektuba Tarih Eklenmesin", label: "Mektuba Tarih Eklenmesin" },
];

const UnfinishedOrderModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.inspect {
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  }

  &.close {
    background-color: #f44336;
    color: white;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

// Add new styled components for file upload
const FileDropZone = styled.div`
  border: 2px dashed #4CAF50;
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
    border-color: #2E7D32;
  }
`;

const FileUploadText = styled.p`
  color: #4CAF50;
  font-weight: 500;
`;

const FileGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 2px solid #4CAF50;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FileIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 10px;
  font-weight: bold;
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

// Function to get file extension icon
const getFileExtensionIcon = (fileName) => {
  const extension = fileName.split('.').pop().toUpperCase();
  switch (extension) {
    case 'PDF': return 'PDF';
    case 'DOCX':
    case 'DOC': return 'DOC';
    case 'XLSX':
    case 'XLS': return 'XLS';
    default: return 'FILE';
  }
};

const Jail = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [searchParams] = useSearchParams();
  const probeOrderId = searchParams.get("order_id");
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const [selectedCardpostalIds, setSelectedCardpostalIds] = useState([]);
  const [envelopeColorOptions, setEnvelopeColorOptions] = useState([]);
  const [paperColorOptions, setPaperColorOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [scentOptions, setScentOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [cardpostalImages, setCardpostalImages] = useState([]);
  const [selectedCardpostals, setSelectedCardpostals] = useState([]);
  const [files, setFiles] = useState([]);

  const [showUnfinishedOrderPopup, setShowUnfinishedOrderPopup] =
    useState(false);

  const [envelopeColor, setEnvelopeColor] = useState({
    value: "#FFFFFF",
    label: "Beyaz",
  });
  const [paperColor, setPaperColor] = useState({
    value: "#FFFFFF",
    label: "Beyaz",
  });
  const [orderId, setOrderId] = useState(probeOrderId || null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pages, setPages] = useState([]);
  const [fontSize, setFontSize] = useState("12pt");
  const [images, setImages] = useState([]);
  const [scentOption, setScentOption] = useState({
    value: "Koku Eklenmesin",
    label: "Koku Eklenmesin",
  });
  const [categoryOption, setCategoryOption] = useState({
    value: "Kartpostal Eklenmesin",
    label: "Kartpostal Eklenmesin",
    id: 0,
  });
  const [dateOption, setDateOption] = useState({
    value: "Mektuba Tarih Eklensin",
    label: "Mektuba Tarih Eklensin",
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const quillRef = useRef(null);
  const token = localStorage.getItem("token");

  // File upload drop handler
  const onFilesDrop = async (acceptedFiles) => {
    if (!orderId) {
      console.error("No order ID available");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", orderId);

    // Her dosyayı FormData'ya ekle
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/file?order_id=` + orderId, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Yeni yüklenen dosyaları state'e ekle
      const newFiles = response.data.files.map((file) => ({
        url: `${BASE_URL}/${file.path}`,
        id: file.path.split("/").pop(),
        path: file.path,
        name: file.path.split("/").pop(), // Orijinal dosya adını almak için değiştirilebilir
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      console.log("Files uploaded successfully:", response.data);
    } catch (error) {
      console.error(
        "Error uploading files:",
        error.response?.data || error.message
      );
    }
  };

  // File removal handler
  const removeFile = async (id, path) => {
    if (!orderId) {
      console.error("No order ID available");
      return;
    }

    try {
      const fileName = path.split("/").pop(); // Sadece dosya adını ayıkla
      await axios.delete(`${BASE_URL}/files/${orderId}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Silinen dosyayı state'den çıkar
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      console.log(`File ${fileName} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
    }
  };

  // File dropzone configuration
  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      onDrop: onFilesDrop,
    });

  // Modified useEffect for fetching existing order data
  useEffect(() => {
    const fetchExistingOrder = async () => {
      if (probeOrderId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/order/${probeOrderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const orderData = response.data;

          // Update text content
          setEditorContent(orderData.envelope_text || "");

          // Update envelope color
          if (orderData.envelope_color) {
            const matchingEnvelopeColor = envelopeColorOptions.find(
              (option) => option.value === orderData.envelope_color
            );
            if (matchingEnvelopeColor) {
              setEnvelopeColor(matchingEnvelopeColor);
            }
          }

          // Update paper color
          if (orderData.paper_color) {
            const matchingPaperColor = paperColorOptions.find(
              (option) => option.value === orderData.paper_color
            );
            if (matchingPaperColor) {
              setPaperColor(matchingPaperColor);
            }
          }

          // Update scent option
          if (orderData.smell) {
            const matchingScent = scentOptions.find(
              (option) => option.value === orderData.smell
            );
            if (matchingScent) {
              setScentOption(matchingScent);
            }
          }

          if (orderData.add_date !== undefined) {
            const selectedDateOption =
              orderData.add_date === 1
                ? {
                    value: "Mektuba Tarih Eklensin",
                    label: "Mektuba Tarih Eklensin",
                  }
                : {
                    value: "Mektuba Tarih Eklenmesin",
                    label: "Mektuba Tarih Eklenmesin",
                  };

            setDateOption(selectedDateOption);
          }

          // Update selected cardpostals
          if (orderData.cardpostals && orderData.cardpostals.length > 0) {
            const cardpostalPromises = orderData.cardpostals.map(async (id) => {
              try {
                // const response = await axios.get(
                //   `${BASE_URL}/cardpostals/images/${id}`
                // );
                return {
                  id: id,
                  url: `${BASE_URL}/cardpostals/images/${id}`,
                  timestamp: new Date().getTime() + Math.random(),
                };
              } catch (error) {
                console.error(`Error fetching cardpostal ${id}:`, error);
                return null;
              }
            });

            const fetchedCardpostals = await Promise.all(cardpostalPromises);
            const validCardpostals = fetchedCardpostals.filter(Boolean);

            setSelectedCardpostals(validCardpostals);
            setSelectedCardpostalIds(validCardpostals.map((cp) => cp.id));
          }

          // Update uploaded photos
          if (orderData.photos && orderData.photos.length > 0) {
            const photosList = orderData.photos.map((photo, index) => ({
              url: `${BASE_URL}/${photo}`,
              id: index,
              path: photo,
            }));
            setImages(photosList);
          }

          if (orderData.files && orderData.files.length > 0) {
            console.log(orderData.files)
            const filesList = orderData.files.map((file, index) => ({
              url: `${BASE_URL}/${file}`,
              path: file,
              id: file.split("/").pop(),
              name: file.split("/").pop()
            }));
            console.log(filesList)
            setFiles(filesList);
          }

          setIsInitialLoad(false);
        } catch (error) {
          console.error("Error fetching existing order:", error);
        }
      }
    };

    if (
      envelopeColorOptions.length > 0 &&
      paperColorOptions.length > 0 &&
      scentOptions.length > 0 &&
      dateOptions.length > 0
    ) {
      fetchExistingOrder();
    }
  }, [
    probeOrderId,
    envelopeColorOptions,
    paperColorOptions,
    scentOptions,
    categoryOptions,
    dateOptions,
  ]);

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  // Add new function to close preview
  const closePreview = () => {
    setPreviewImage(null);
  };

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/check_status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.not_send === true) {
          setShowUnfinishedOrderPopup(true);
        }
      } catch (error) {
        console.error("Error checking order status:", error);
      }
    };

    // Only check status if no specific order_id is provided
    if (!probeOrderId) {
      checkOrderStatus();
    }
  }, [probeOrderId, token]);

  const handleInspectUnfinishedOrders = () => {
    setShowUnfinishedOrderPopup(false);
    navigate("/components/innerPages/UserAccountPage#gonderilmeyenler");
  };

  const handleCloseUnfinishedOrderPopup = () => {
    setShowUnfinishedOrderPopup(false);
  };

  // Modified initial order creation to check for probeOrderId
  useEffect(() => {
    const postOrder = async () => {
      if (!probeOrderId) {
        // Only create new order if no probe order exists
        try {
          const response = await axios.post(
            `${BASE_URL}/order`,
            {
              sender_name: "",
              sender_surname: "",
              sender_city: "",
              sender_district: "",
              sender_address: "",
              receiver_name: "",
              receiver_surname: "",
              receiver_city: "",
              jail_name: "",
              jail_address: "",
              father_name: "",
              ward_id: "",
              letter_type: "Cezaevine Mektup",
              order_price: 0,
              status: "Sipariş Oluşturuldu",
              envelope_text: "",
              envelope_color: "",
              paper_color: "",
              photos: [],
              files: [],
              cardpostals: [],
              smell: "",
              shipment_type: "",
              tax: 0,
              discount: 0,
              add_date: true,
              track_id: "",
              track_link: "",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const newOrderId = response.data.id;
          setOrderId(newOrderId);
          console.log("Order successfully posted:", newOrderId);
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Error posting order:", error);
        }
      }
    };

    postOrder();
  }, [probeOrderId]);

  // PUT isteği yaparak sipariş güncellemelerini gerçekleştirme
  // PUT işlemini gerçekleştir
  const handleOrderUpdates = async () => {
    try {
      if (!isInitialLoad && orderId) {
        const putResponse = await axios.put(
          `${BASE_URL}/order/${orderId}`,
          {
            envelope_color: envelopeColor?.value.toString() || "",
            paper_color: paperColor?.value.toString() || "",
            smell: scentOption?.value.toString() || "",
            envelope_text: editorContent.toString() || "",
            status: "Sipariş Bekleniyor",
            add_date:
              dateOption?.value.toString() === "Mektuba Tarih Eklensin" ? 1 : 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Order successfully updated:", putResponse.data);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    const updatedFields = {};
    if (envelopeColor) updatedFields.envelope_color = envelopeColor.value;
    if (paperColor) updatedFields.paper_color = paperColor.value;
    if (scentOption) updatedFields.smell = scentOption.value;
    if (editorContent) updatedFields.envelope_text = editorContent;
    if (dateOption)
      updatedFields.add_date =
        String(dateOption.value) === "Mektuba Tarih Eklensin" ? 1 : 0;

    if (Object.keys(updatedFields).length > 0) {
      handleOrderUpdates(updatedFields); // Değişiklikleri PUT isteği ile gönder
    }
  }, [envelopeColor, paperColor, scentOption, editorContent, dateOption]);

  // Dinamik veri çekimi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const envelopeColorResponse = await axios.get(
          `${BASE_URL}/envelope_colors`
        );
        const paperColorResponse = await axios.get(
          `${BASE_URL}/paper_colors`
        );
        const templateResponse = await axios.get(`${BASE_URL}/schemas`);
        const scentResponse = await axios.get(
          `${BASE_URL}/envelope_smell`
        );
        const cardpostalCatResponse = await axios.get(
          `${BASE_URL}/categories`
        );

        // Gelen veriler kullanıma uygun hale getiriliyor
        setEnvelopeColorOptions(
          envelopeColorResponse.data.map((item) => ({
            value: item.color_code,
            label: item.color_name,
          }))
        );

        setPaperColorOptions(
          paperColorResponse.data.map((item) => ({
            value: item.color_code,
            label: item.color_name,
          }))
        );

        setTemplateOptions(
          templateResponse.data.map((item) => ({
            value: item.text,
            label: item.title,
          }))
        );

        setScentOptions(
          scentResponse.data.map((item) => ({
            value: item.smell_name,
            label: item.smell_name,
          }))
        );

        setCategoryOptions(
          cardpostalCatResponse.data.map((item) => ({
            value: item.name,
            label: item.name,
            id: item.id,
          }))
        );
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = async (category) => {
    setCategoryOption(category);
    try {
      const response = await axios.get(
        `${BASE_URL}/cardpostals/${category.id}`
      );
      const cardpostalPhotos = response.data;

      const cardpostalImagesPromises = cardpostalPhotos.map(async (photo) => {
        try {
          return {
            url: `${BASE_URL}/cardpostals/images/${photo.id}`,
            id: photo.id,
          };
        } catch (imageError) {
          console.error(
            `Error fetching image for photo ID ${photo.id}:`,
            imageError
          );
          return null; // Return null or handle it as needed
        }
      });

      const cardpostalImages = await Promise.all(cardpostalImagesPromises);
      setCardpostalImages(cardpostalImages.filter(Boolean)); // Filter out null values
    } catch (error) {
      console.error("Error fetching card postal data:", error);
    }
  };

  const addCardpostal = (cardpostal) => {
    const newSelectedCardpostal = {
      id: cardpostal.id,
      url: cardpostal.url,
      timestamp: new Date().getTime(), // Add timestamp to differentiate multiple instances
    };

    const updatedSelectedCardpostals = [
      ...selectedCardpostals,
      newSelectedCardpostal,
    ];
    const updatedSelectedIds = [...selectedCardpostalIds, cardpostal.id];

    setSelectedCardpostals(updatedSelectedCardpostals);
    setSelectedCardpostalIds(updatedSelectedIds);
    updateOrder(updatedSelectedIds);
  };

  // Add removeCardpostal function
  const removeCardpostal = async (timestamp) => {
    const removedCardpostal = selectedCardpostals.find(
      (cp) => cp.timestamp === timestamp
    );
    if (!removedCardpostal) return;

    const updatedSelectedCardpostals = selectedCardpostals.filter(
      (cp) => cp.timestamp !== timestamp
    );
    const updatedSelectedIds = updatedSelectedCardpostals.map((cp) => cp.id);

    setSelectedCardpostals(updatedSelectedCardpostals);
    setSelectedCardpostalIds(updatedSelectedIds);

    updateOrder(updatedSelectedIds);
  };

  // PUT request to update the order with new cardpostal IDs
  const updateOrder = async (cardpostalIds) => {
    try {
      const putResponse = await axios.put(
        `${BASE_URL}/order/${orderId}`,
        {
          cardpostals: cardpostalIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Order successfully updated:", putResponse.data);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setEditorContent(template ? template.value : "");
  };

  const editorStyle = {
    backgroundColor: paperColor ? paperColor.value : "#FFF",
    minHeight: "200px",
    height: "300px",
  };

  const splitContentIntoPages = (content) => {
    const containerHeight = 29.7 * 37.795; // A4 height in pixels
    const linesPerPage = Math.floor(containerHeight / 24);
    const words = content.split(" ");
    let currentPage = [];
    let allPages = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + " " + word;
      if (testLine.length > 90) {
        currentPage.push(currentLine);
        currentLine = word;
        if (currentPage.length >= linesPerPage) {
          allPages.push(currentPage);
          currentPage = [];
        }
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine.length > 0) currentPage.push(currentLine);
    if (currentPage.length > 0) allPages.push(currentPage);

    return allPages;
  };

  const handleShowPreview = () => {
    const pages = splitContentIntoPages(editorContent);
    setPages(pages);
    setShowPreview(true);
  };

  // Fotoğraf ekleme fonksiyonu
  const onDrop = async (acceptedFiles) => {
    if (!orderId) {
      console.error("No order ID available");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", orderId);

    // Append each file to the FormData
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/photo/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: {
          order_id: orderId,
        },
      });

      // Add the newly uploaded images to the state
      const newImages = response.data.photos.map((photo) => ({
        url: `${BASE_URL}/${photo.path}`,
        id: photo.path.split("/").pop(),
        path: photo.path,
      }));

      setImages([...images, ...newImages]);
      console.log("Photos uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const removeImage = async (id, path) => {
    if (!orderId) {
      console.error("No order ID available");
      return;
    }

    try {
      const photoName = path.split("/").pop();
      await axios.delete(`${BASE_URL}/photos/${orderId}/${photoName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted image from the state
      setImages(images.filter((image) => image.id !== id));
      console.log("Photo deleted successfully");
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  useEffect(() => {
    const logFontSize = () => {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        const formats = quill.getFormat(range.index);
        const sizeMap = {
          small: "6pt",
          normal: "10pt",
          large: "14pt",
          huge: "18pt",
        };
        setFontSize(sizeMap[formats.size] || "10pt"); // Varsayılan boyut
        console.log("Seçilen Font Boyutu:", formats.size || "Varsayılan Boyut");
      }
    };
    logFontSize();
  }, [editorContent]);

  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
      <StepperWithContent activeStep={0} links={[]} />
      <UnfinishedOrderModal
        isOpen={showUnfinishedOrderPopup}
        onRequestClose={handleCloseUnfinishedOrderPopup}
        contentLabel="Unfinished Orders"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <ModalTitle>Tamamlanmamış siparişleriniz bulunmaktadır.</ModalTitle>
        <ModalTitle>İncelemek ister misiniz?</ModalTitle>
        <ModalButtonContainer>
          <ModalButton
            className="inspect"
            onClick={handleInspectUnfinishedOrders}
          >
            İncele
          </ModalButton>
          <ModalButton
            className="close"
            onClick={handleCloseUnfinishedOrderPopup}
          >
            Kapat
          </ModalButton>
        </ModalButtonContainer>
      </UnfinishedOrderModal>
      <Container>
        <DropdownRow>
          <DropdownColumn>
            <ColorLabel
              color={
                envelopeColor?.label === "Beyaz"
                  ? "#000000"
                  : envelopeColor?.value
              }
            >
              Zarf Rengi
            </ColorLabel>
            <Select
              options={envelopeColorOptions}
              onChange={setEnvelopeColor}
              value={envelopeColor}
              placeholder="Zarf Rengini Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel
              color={
                paperColor?.label === "Beyaz" ? "#000000" : paperColor?.value
              }
            >
              Kağıt Rengi
            </ColorLabel>
            <Select
              options={paperColorOptions}
              onChange={setPaperColor}
              value={paperColor}
              placeholder="Kağıt Rengini Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel>Hazır Mektup Şablonları</ColorLabel>
            <Select
              options={templateOptions}
              onChange={handleTemplateChange}
              placeholder="Hazır Şablon Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>
        </DropdownRow>

        <ColorLabel>Mektup Metni</ColorLabel>
        <ReactQuill
          ref={quillRef}
          value={editorContent}
          onChange={setEditorContent}
          style={{
            ...editorStyle,
            marginBottom: "70px",
          }}
          modules={{
            toolbar: [
              [{ font: [] }, { size: ["small", "normal", "large", "huge"] }],
              [{ color: [] }, { background: [] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["clean"],
            ],
          }}
        />

        <PhotoUploader
          images={images}
          isDropzoneActive={true}
          isDeleteButtonActive={true}
          orderId={orderId}
          token={token}
        />

        <FileUploader
          files={files}
          isDropzoneActive={true}
          isDeleteButtonActive={true}
          orderId={orderId}
          token={token}
        />

        <DropdownRow>
          <DropdownColumn>
            <ColorLabel>Koku</ColorLabel>
            <Select
              options={scentOptions}
              value={scentOption}
              onChange={setScentOption}
              placeholder="Koku Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel>Mektuba Tarih Ekle</ColorLabel>
            <Select
              options={dateOptions}
              value={dateOption}
              onChange={setDateOption}
              placeholder="Tarih Ekleme Durumu"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel>Kartpostal Kategorisi</ColorLabel>
            <Select
              options={categoryOptions}
              value={categoryOption}
              onChange={handleCategoryChange} // Seçilen kategoriye göre veriyi çekiyoruz
              placeholder="Kategori Seçiniz"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </DropdownColumn>
        </DropdownRow>

        {selectedCardpostals.length > 0 && (
          <>
            <SectionTitle>Seçilen Kartpostallar</SectionTitle>
            <SelectedCardpostalsGallery>
              {selectedCardpostals.map((cardpostal) => (
                <SelectedCardpostalContainer key={cardpostal.timestamp}>
                  <SelectedCardpostalImage
                    src={cardpostal.url}
                    alt={`Selected Cardpostal ${cardpostal.id}`}
                    onClick={() => handleImagePreview(cardpostal.url)}
                    style={{ cursor: "pointer" }}
                  />
                  <RemoveButton
                    onClick={() => removeCardpostal(cardpostal.timestamp)}
                  >
                    Sil
                  </RemoveButton>
                </SelectedCardpostalContainer>
              ))}
            </SelectedCardpostalsGallery>
          </>
        )}

        {cardpostalImages.length > 0 && (
          <>
            <SectionTitle>Mevcut Kartpostallar</SectionTitle>
            <ImageGallery>
              {cardpostalImages.map((image) => (
                <ImageContainer key={image.id}>
                  <UploadedImage
                    src={image.url}
                    alt={image.id}
                    onClick={() => handleImagePreview(image.url)}
                    style={{ cursor: "pointer" }}
                  />
                  <AddButton onClick={() => addCardpostal(image)}>
                    Ekle
                  </AddButton>
                </ImageContainer>
              ))}
            </ImageGallery>
          </>
        )}

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={!!previewImage}
          onRequestClose={closePreview}
          contentLabel="Image Preview"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 1000,
            },
          }}
        >
          {previewImage && (
            <>
              <PreviewImage src={previewImage} alt="Preview" />
              <ClosePreviewButton onClick={closePreview}>×</ClosePreviewButton>
            </>
          )}
        </ImagePreviewModal>

        <ActionButton onClick={handleShowPreview}>
          A4 Önizlemesini Göster
        </ActionButton>

        <Modal
          isOpen={showPreview}
          onRequestClose={() => setShowPreview(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "800px",
              height: "80%",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <h2>A4 Önizlemesi</h2>
          {pages.map((page, index) => (
            <PreviewContainer key={index} paperColor={paperColor?.value}>
              <TextContent
                dangerouslySetInnerHTML={{ __html: page.join(" ") }}
                style={{ fontSize }}
              />
            </PreviewContainer>
          ))}
          <ActionButton onClick={() => setShowPreview(false)}>
            Kapat
          </ActionButton>
        </Modal>
        <ButtonContainer>
          <ContinueButton
            href={`/components/letterTypes/DetailsPage?order_id=${orderId}`}
          >
            Devam Et
          </ContinueButton>
        </ButtonContainer>
      </Container>
    </AnimationRevealPage>
  );
};

export default Jail;
