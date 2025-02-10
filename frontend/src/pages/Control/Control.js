import axios from "axios";
import Header from "components/headers/light.js";
import { StepperWithContent } from "components/stepper/Stepper";
import DOMPurify from "dompurify"; // Added for safe HTML rendering
import AnimationRevealPage from "helpers/AnimationRevealPage";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // react-router'dan URL parametresi okumak için
import styled, { createGlobalStyle } from "styled-components";
import EnvelopePreview from "./EnvelopePreview";
import PhotoGallery from "./PhotoGallery";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lobster';
    src: url('/fonts/Lobster-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Goudy Bookletter 1911';
    src: url('/fonts/GoudyBookletter1911-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Montserrat';
    src: url('/fonts/Montserrat-SemiBold.ttf') format('truetype');
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f7f9fc;
  width: 100%;
  margin: auto;
  border-radius: 12px;

  @media (min-width: 1024px) {
    flex-direction: row;
    width: 90%;
    max-width: 1200px;
  }
`;

const EnvelopeContainer = styled.div`
  width: 100%;
  height: auto;
  max-width: 600px;
  position: relative;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    margin-right: 20px;
    margin-bottom: 0;
    max-width: 18cm;
    width: 18cm;
    height: 13cm;
  }
`;

const EnvelopeHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 5px;
  z-index: 2;
  position: relative;

  @media (min-width: 1024px) {
    flex-direction: row;
    text-align: left;
  }
`;

const SenderInfo = styled.div`
  .company,
  .sender {
    font-family: "Lobster", cursive;
    margin-bottom: -7px;
  }

  .company {
    font-size: 22px;

    @media (min-width: 1024px) {
      font-size: 28px;
    }
  }

  .sender {
    font-size: 22px;

    @media (min-width: 1024px) {
      font-size: 28px;
    }
  }
`;

const LogoContainer = styled.div`
  position: absolute; // Change to absolute positioning
  top: 3px; // 10px from the top
  right: 3px; // 10px from the right
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3; // Ensure it's above other elements
`;

const Logo = styled.img`
  width: 40px;
  height: auto;
`;

const Address = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
  z-index: 2;
  position: relative;
  font-family: "Goudy Bookletter 1911", serif;
  
  @media (min-width: 1024px) {
    font-size: 18px;
    text-align: left;
  }
`;

const RecipientInfo = styled.div`
  font-size: 16px;
  line-height: 1.5;
  z-index: 2;
  position: relative;
  font-family: "Goudy Bookletter 1911", serif;
  
  @media (min-width: 1024px) {
    font-size: 18px;
    align-self: flex-start;
    text-align: left;
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 500px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  width: 100%;

  @media (min-width: 1024px) {
    justify-content: flex-end;
    width: 90%;
    max-width: 1200px;
  }
`;

const ContinueButton = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
  width: 100%;

  @media (min-width: 1024px) {
    width: auto;
  }

  &:hover {
    background-color: #1e40af;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
  padding: 5px;
  background: linear-gradient(135deg, #fdfbfb, #ebedee); /* Hafif degrade */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: #6c5ce7; /* Simge arka plan rengi */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
  font-size: 20px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #333;
`;

const Value = styled.div`
  margin-top: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const BorderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
  }
`;

const DateDisplay = styled.div`
  font-family: "Goudy Bookletter 1911", serif;
  text-align: center;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;


// Add this new styled component for A4 Paper
const A4Paper = styled.div`
  width: 210mm; // A4 standard width
  min-height: 297mm; // A4 standard height
  background-color: ${(props) =>
    props.paperColor || "#ffffff"}; // Dynamic paper color
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto 20px;
  padding: 20mm;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 1024px) {
    width: 90%;
    min-height: 200mm;
    padding: 10mm;
  }
`;

const PaperContent = styled.div`
  line-height: 1.6;
  font-size: 16px;
`;

// Previous styled components remain the same, add these new ones:
const SectionTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  font-family: "Montserrat", serif;
  margin-bottom: 30px;
  font-size: 2.5rem;
  position: relative;
  letter-spacing: 1.5px;
  font-weight: 700;

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  }

  &::before {
    width: 50px;
    bottom: -5px;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    font-size: 2rem;

    &::before,
    &::after {
      width: 70px;
    }
  }
`;


const ImagePreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PreviewImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const ClosePreviewButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// Add these new styled components to the existing styled components
const FileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 1200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 90%;
  }
`;

const FileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileIcon = styled.span`
  font-size: 24px;
  color: #2563eb;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #333;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 8px 15px;
  background-color: #2563eb;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e40af;
  }
`;

const Envelope = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const FRONTEND_PORT = process.env.FRONTEND_PORT
  const [orderData, setOrderData] = useState(null); // Sipariş verilerini tutmak için state
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [jailAddress, setJailAddress] = useState("");
  const [jailName, setJailName] = useState("");
  const [searchParams] = useSearchParams(); // URL parametrelerini okumak için
  const orderId = searchParams.get("order_id"); // ?order_id parametresini al
  const token = localStorage.getItem("token");
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (orderId) {
          const filesResponse = await axios.get(
            `${BASE_URL}/files/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (filesResponse.data.status === "success") {
            const fileUrls = filesResponse.data.files.map(
              (file) => `${BASE_URL}/${file}`
            );
            setFiles(fileUrls);
          }
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    const fetchOrderData = async () => {
      try {
        if (orderId) {
          const orderResponse = await axios.get(
            `${BASE_URL}/order/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const order = orderResponse.data;
          setOrderData(order);

          // Fetch photos
          if (order.photos && order.photos.length > 0) {
            const photoUrls = order.photos.map(
              (photo) => `${BASE_URL}/${photo}`
            );
            setPhotos(photoUrls);
          }

          // Şehir bilgisi alma
          if (order.sender_city) {
            const cityResponse = await axios.get(
              `${BASE_URL}/cities/${order.sender_city}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setCityName(cityResponse.data.city_name || "Bilinmiyor");
          }

          // İlçe bilgisi alma
          if (order.sender_district) {
            const districtResponse = await axios.get(
              `${BASE_URL}/towns/${order.sender_district}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setDistrictName(districtResponse.data.town_name || "Bilinmiyor");
          }

          // Cezaevi bilgisi alma
          if (order.jail_name) {
            const jailResponse = await axios.get(
              `${BASE_URL}/jails/${order.jail_name}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setJailAddress(jailResponse.data.address || "Bilinmiyor");
            setJailName(jailResponse.data.name || "Bilinmiyor");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderData();
    fetchFiles();
  }, [orderId, token]);

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const closePreview = () => {
    setSelectedPhoto(null);
  };

  if (!orderData) {
    return null; // Veri yüklenirken bir yükleme ekranı göster
  }

  const sanitizedContent = DOMPurify.sanitize(orderData.envelope_text || "");


  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
      <StepperWithContent
        activeStep={2}
        links={[
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Jail?order_id=${orderId}`,
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/DetailsPage?order_id=${orderId}`,
        ]}
      />
      <GlobalStyle />

      <SectionTitle>Mektubun İçeriği</SectionTitle>
      {/* New A4 Paper Component */}
      <A4Paper paperColor={orderData.paper_color || "#ffffff"}>
        <PaperContent dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </A4Paper>

      <SectionTitle>Mektuba Ekli Fotoğraflar</SectionTitle>
      {photos.length > 0 ? (
        <PhotoGallery photos={photos} onPhotoClick={handlePhotoClick} />
      ) : (
        <SectionTitle style={{ color: "#666", fontSize: "18px" }}>
          Mektuba Eklenmiş Fotoğraf Bulunamamaktadır.
        </SectionTitle>
      )}

      {files.length > 0 && (
        <>
          <SectionTitle>Mektuba Ekli Dosyalar</SectionTitle>
          <FileContainer>
            {files.map((fileUrl, index) => {
              const fileName = fileUrl.split("/").pop();
              return (
                <FileCard key={index}>
                  <FileInfo>
                    <FileIcon>📄</FileIcon>
                    <FileName>{fileName}</FileName>
                  </FileInfo>
                  <DownloadButton
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Görüntüle
                  </DownloadButton>
                </FileCard>
              );
            })}
          </FileContainer>
        </>
      )}

      {selectedPhoto && (
        <ImagePreviewOverlay onClick={closePreview}>
          <ClosePreviewButton onClick={closePreview}>×</ClosePreviewButton>
          <PreviewImage src={selectedPhoto} alt="Preview" />
        </ImagePreviewOverlay>
      )}

      <SectionTitle>Zarf Önizlemesi</SectionTitle>

      <EnvelopePreview order_data={orderData} order_id={orderId} />
      <ButtonContainer>
        <ContinueButton
          href={`/components/letterTypes/PaymentPage?order_id=${orderId}`}
        >
          Devam Et
        </ContinueButton>
      </ButtonContainer>
    </AnimationRevealPage>
  );
};

export default Envelope;
