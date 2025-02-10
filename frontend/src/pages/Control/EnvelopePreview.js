import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";


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

const EnvelopePreview = ({ order_data, order_id }) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [orderData, setOrderData] = useState(order_data || null); // Props'tan gelen order_data'yı başlangıç olarak ayarla
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [jailAddress, setJailAddress] = useState("");
  const [jailName, setJailName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        let order = order_data;

        // Eğer order_data yoksa API'den çek
        if (!order && order_id) {
          const orderResponse = await axios.get(
            `${BASE_URL}/order/${order_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          order = orderResponse.data;
          setOrderData(order);
          console.log(orderData)
        }

        // Eğer order mevcutsa şehir, ilçe ve cezaevi bilgilerini al
        if (order) {
          // Şehir bilgisi alma
          if (order.sender_city) {
            const cityResponse = await axios.get(
              `${BASE_URL}/cities/${order.sender_city}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setCityName(cityResponse.data.city_name || "Bilinmiyor");
          console.log(orderData);

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
  }, [order_id, order_data, token]);

  return (
    <Wrapper>
      <EnvelopeContainer>
        <BorderOverlay>
          <img src="/images/Kenarlik2.png" alt="border" />
        </BorderOverlay>
        <EnvelopeHeader>
          <SenderInfo>
            <div className="company">Aracı Firma : Mektupevi.com</div>
            <div className="sender">
              Gönderen: {orderData?.sender_name || "Bilinmiyor"}{" "}
              {orderData?.sender_surname || ""}
            </div>
          </SenderInfo>
          <LogoContainer>
            <Logo src="/images/logo.png" alt="Mektup Evi Logo" />
            {orderData?.add_date ? (
              <DateDisplay>
                {new Date(orderData.date).toLocaleDateString()}
              </DateDisplay>
            ) : null}
          </LogoContainer>
        </EnvelopeHeader>

        <Content>
          <Address>
            {orderData?.sender_address || "Adres Bilgisi Yok"}
            <br />
            {cityName}/{districtName}
          </Address>

          <RecipientInfo>
            Alıcı: {orderData?.receiver_name || "Bilinmiyor"}{" "}
            {orderData?.receiver_surname || ""}
            <br />
            Koğuş No: {orderData?.ward_id || "Bilinmiyor"}
            <br />
            Baba Adı: {orderData?.father_name || "Bilinmiyor"}
            <br />
            {jailName}
            <br />
            {jailAddress}
          </RecipientInfo>
        </Content>
      </EnvelopeContainer>
      <InfoContainer>
        {/* İlk Satır */}
        <InfoBox>
          <IconWrapper>📄</IconWrapper>
          <Label>Kağıt Rengi</Label>
          <Value>Beyaz</Value>
        </InfoBox>
        <InfoBox>
          <IconWrapper>✉️</IconWrapper>
          <Label>Zarf Rengi</Label>
          <Value>Beyaz</Value>
        </InfoBox>
        {/* İkinci Satır */}
        <InfoBox style={{ gridColumn: "span 2" }}>
          <IconWrapper>🌺</IconWrapper>
          <Label>Mektup Kokusu</Label>
          <Value>Koku eklenmedi.</Value>
        </InfoBox>
        {/* Üçüncü Satır */}
        <InfoBox>
          <IconWrapper>📷</IconWrapper>
          <Label>Fotoğraf Sayısı</Label>
          <Value>0 Adet</Value>
        </InfoBox>
        <InfoBox>
          <IconWrapper>📑</IconWrapper>
          <Label>Kartpostal Sayısı</Label>
          <Value>0 Adet</Value>
        </InfoBox>
        {/* Dördüncü Satır */}
        <InfoBox style={{ gridColumn: "span 2" }}>
          <IconWrapper>📅</IconWrapper>
          <Label>Postaya Verileceği Tarih</Label>
          <Value>Çarşamba, 27 Kasım 2024</Value>
        </InfoBox>
      </InfoContainer>
    </Wrapper>
  );
};

export default EnvelopePreview;