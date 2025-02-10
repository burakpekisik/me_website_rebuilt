import axios from "axios";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import EnvelopePreview from "pages/Control/EnvelopePreview.js";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal"; // Modal için react-modal kütüphanesi
import ReactQuill from "react-quill"; // Text editor için react-quill kütüphanesi
import "react-quill/dist/quill.snow.css"; // react-quill teması
import { useSearchParams } from "react-router-dom";
import Select from "react-select"; // Dropdown menüler için react-select kütüphanesi
import styled from "styled-components";
import Header from "../../components/headers/light.js";

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

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
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

// Add new styled components for selected cardpostals
const SelectedCardpostalsGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 2px solid #4caf50;
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
  border: 2px solid #4caf50;
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

const DisabledPageMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  padding: 20px;
`;

// Function to get file extension icon
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

const JailDisabled = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [searchParams] = useSearchParams();
  const probeOrderId = searchParams.get("order_id");
  const [previewImage, setPreviewImage] = useState(null);

  const [selectedCardpostalIds, setSelectedCardpostalIds] = useState([]);
  const [envelopeColorOptions, setEnvelopeColorOptions] = useState([]);
  const [paperColorOptions, setPaperColorOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [scentOptions, setScentOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [cardpostalImages, setCardpostalImages] = useState([]);
  const [selectedCardpostals, setSelectedCardpostals] = useState([]);
  const [files, setFiles] = useState([]);

  const [envelopeColor, setEnvelopeColor] = useState({
    value: "#FFFFFF",
    label: "Beyaz",
  });
  const [paperColor, setPaperColor] = useState({
    value: "#FFFFFF",
    label: "Beyaz",
  });
  const [orderData, setOrderData] = useState([]);
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

  const quillRef = useRef(null);
  const token = localStorage.getItem("token");
  const [orderStatus, setOrderStatus] = useState(null);

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

          setOrderData(response.data);
          const orderData = response.data;
          setOrderStatus(response.data.status);

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
            console.log(orderData.files);
            const filesList = orderData.files.map((file, index) => ({
              url: `${BASE_URL}/${file}`,
              path: file,
              id: file.split("/").pop(),
              name: file.split("/").pop(),
            }));
            console.log(filesList);
            setFiles(filesList);
          }
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

  useEffect(() => {
    const logFontSize = () => {
      if (quillRef.current && quillRef.current.getEditor) {
        try {
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
            setFontSize(sizeMap[formats.size] || "10pt");
            console.log(
              "Seçilen Font Boyutu:",
              formats.size || "Varsayılan Boyut"
            );
          }
        } catch (error) {
          console.error("Error getting Quill editor:", error);
          // Fallback to default font size
          setFontSize("10pt");
        }
      }
    };

    // Add a slight delay to ensure the ref is set
    const timer = setTimeout(logFontSize, 100);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [editorContent, quillRef]);

  // Check if the order status is one that should show a disabled page
  const shouldShowDisabledPage = () => {
    const disabledStatuses = ["Hazırlanıyor", "Gönderildi", "Teslim Edildi"];
    return !disabledStatuses.includes(orderStatus);
  };

  // If the order status requires a disabled page, render a message
  if (shouldShowDisabledPage()) {
    return (
      <AnimationRevealPage>
        <Header roundedHeaderButton={true} />
        <DisabledPageMessage>
          <h2>İşlem Durumu</h2>
          <p>
            Bu sipariş şu anda {orderStatus} durumunda olduğundan detayları
            görüntüleyemezsiniz.
          </p>
        </DisabledPageMessage>
      </AnimationRevealPage>
    );
  }

  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
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
              value={envelopeColor}
              isDisabled={true} // Düzenlenemez hale getirir
              placeholder="Zarf Rengini Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  backgroundColor: "#f9f9f9", // Görsel olarak düzenlenemez olduğunu belirtmek için
                  cursor: "not-allowed", // Kullanıcıya görsel geri bildirim
                  boxShadow: "none", // Daha temiz bir görünüm için
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
              isDisabled={true}
              placeholder="Kağıt Rengini Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "not-allowed",
                  backgroundColor: "#f9f9f9",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel>Hazır Mektup Şablonları</ColorLabel>
            <Select
              options={templateOptions}
              isDisabled={true}
              placeholder="Hazır Şablon Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "not-allowed",
                  backgroundColor: "#f9f9f9",
                }),
              }}
            />
          </DropdownColumn>
        </DropdownRow>

        <ColorLabel>Mektup Metni</ColorLabel>
        <ReactQuill
          ref={quillRef}
          value={editorContent}
          readOnly={true} // Düzenlenemez hale getirir
          style={{
            ...editorStyle,
            marginBottom: "70px",
            cursor: "not-allowed", // Kullanıcıya düzenlenemez olduğunu görsel olarak iletmek için
          }}
          modules={{
            toolbar: false, // Araç çubuğunu gizler
          }}
        />

        {images.length > 0 && (
          <ImageGallery>
            {images.map((image) => (
              <ImageContainer key={image.id}>
                <UploadedImage
                  src={image.url}
                  alt={image.id}
                  onClick={(e) => handleImagePreview(image.url, e)}
                  style={{ cursor: "pointer" }}
                />
              </ImageContainer>
            ))}
          </ImageGallery>
        )}

        {files.length > 0 && (
          <FileGallery>
            {files.map((file) => (
              <FileContainer key={file.id}>
                <FileIcon>{getFileExtensionIcon(file.name)}</FileIcon>
                <FileDetails>
                  <FileNameTruncated>{file.name}</FileNameTruncated>
                </FileDetails>
              </FileContainer>
            ))}
          </FileGallery>
        )}

        <DropdownRow>
          <DropdownColumn>
            <ColorLabel>Koku</ColorLabel>
            <Select
              options={scentOptions}
              value={scentOption}
              onChange={setScentOption}
              isDisabled={true}
              placeholder="Koku Seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "not-allowed",
                  backgroundColor: "#f9f9f9",
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
              isDisabled={true}
              placeholder="Tarih Ekleme Durumu"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "not-allowed",
                  backgroundColor: "#f9f9f9",
                }),
              }}
            />
          </DropdownColumn>

          <DropdownColumn>
            <ColorLabel>Kartpostal Kategorisi</ColorLabel>
            <Select
              options={categoryOptions}
              value={categoryOption}
              isDisabled={true}
              placeholder="Kategori Seçiniz"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "not-allowed",
                  backgroundColor: "#f9f9f9",
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
      </Container>
      <EnvelopePreview order_id={probeOrderId} />
    </AnimationRevealPage>
  );
};

export default JailDisabled;
