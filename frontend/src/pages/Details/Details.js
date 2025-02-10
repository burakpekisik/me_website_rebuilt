import axios from "axios";
import { StepperWithContent } from "components/stepper/Stepper.js";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/headers/light.js";
import "./DetailsPage.css";

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

const ShipmentTypeRadio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  /* Radio icon styling */
  input[type="radio"] {
    appearance: none; /* Tarayıcı varsayılan stilini kaldırır */
    width: 16px;
    height: 16px;
    border: 2px solid #6c63ff;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
  }

  input[type="radio"]:checked {
    background-color: #6c63ff;
  }

  input[type="radio"]::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  input[type="radio"]:checked::before {
    opacity: 1;
  }
`;

const InfoButton = styled.button`
  margin-left: auto;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a42cc;
  }
`;

const FormComponent = () => {
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_city: "",
    sender_district: "",
    sender_address: "",
    receiver_name: "",
    receiver_city: "",
    jail_name: "",
    father_name: "",
    ward_id: "",
    receiver_phone: "",
    shipment_date: "",
    shipment_type: "",
  });

  const BASE_URL = process.env.REACT_APP_API_URL
  const FRONTEND_PORT = process.env.FRONTEND_PORT
  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);
  const [jails, setJails] = useState([]);
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [, setSelectedShipmentType] = useState(null);
  const token = localStorage.getItem("token");

  // Use useLocation to get the current URL and extract order_id
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const order_id = searchParams.get("order_id"); // Extract order_id from URL

  useEffect(() => {
    const fetchShipmentTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/shipment_type`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShipmentTypes(response.data);

        // Set default shipment type (first one)
        if (response.data.length > 0) {
          setSelectedShipmentType(response.data[0]);
          setFormData((prevData) => ({
            ...prevData,
            shipment_type: response.data[0].type_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching shipment types:", error);
      }
    };

    fetchShipmentTypes();
  }, [token]);

  // Calculate default post date
  const calculateDefaultPostDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Check if it's a weekend (Saturday or Sunday)
    if (currentDay === 6 || currentDay === 0) {
      // Move to the next Monday
      now.setDate(now.getDate() + (8 - currentDay));
    } else if (currentHour >= 14) {
      // After 14:00 on a weekday, move to the next business day
      now.setDate(now.getDate() + (currentDay === 5 ? 3 : 1)); // Friday moves to Monday, others +1 day
    }

    return now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    // Set initial post date
    setFormData((prevData) => ({
      ...prevData,
      postDate: calculateDefaultPostDate(),
    }));
  }, []);

  useEffect(() => {
    if (order_id) {
      const fetchOrderData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/order/${order_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.sender_city) {
            await fetchTowns(response.data.sender_city); // Fetch towns based on sender's city
          }
          if (response.data.receiver_city) {
            console.log(response.data.receiver_city);
            await fetchJails(response.data.receiver_city); // Fetch jails based on recipient's city
          }

          // Make sure to match the keys in the response to your formData structure
          setFormData({
            sender_name: response.data.sender_name || "",
            sender_city: response.data.sender_city || "",
            sender_district: response.data.sender_district || "",
            sender_address: response.data.sender_address || "",
            receiver_name: response.data.receiver_name || "",
            receiver_city: response.data.receiver_city || "",
            jail_name: response.data.jail_name || "",
            father_name: response.data.father_name || "",
            ward_id: response.data.ward_id || "",
            receiver_phone: response.data.receiver_phone || "",
            shipment_date:
              response.data.shipment_date || calculateDefaultPostDate(),
            shipment_type: response.data.shipment_type || "",
          });
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };

      fetchOrderData();
    }
  }, [order_id, token]);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [token]);

  const fetchTowns = async (cityId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/towns/city/${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTowns(response.data);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  };

  const fetchJails = async (cityId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/jails/city/${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJails(response.data);
    } catch (error) {
      console.error("Error fetching jails:", error);
    }
  };

  const [isDirty, setIsDirty] = useState(false); // Formun değiştiğini takip etmek için

  const handleChange = async (e) => {
    const { name, value } = e.target;
    // Formu güncelle
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setIsDirty(true);

    // Şehir değiştiyse ilgili verileri getir
    if (name === "sender_city") {
      await fetchTowns(value); // Gönderen şehri değiştiyse ilçeleri getir
    } else if (name === "receiver_city") {
      await fetchJails(value); // Alıcı şehri değiştiyse cezaevlerini getir
    }
  };

  const showShipmentTypeInfo = (description) => {
    alert(description);
  };

  // `formData` her güncellendiğinde otomatik olarak PUT isteği yap
  useEffect(() => {
    if (!isDirty) return;
    if (order_id) {
      const updateOrder = async () => {
        try {
          const putResponse = await axios.put(
            `${BASE_URL}/order/${order_id}`,
            formData,
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

      updateOrder();
    }
  }, [formData, order_id, token, isDirty]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
      <StepperWithContent
        activeStep={1}
        links={[
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Jail?order_id=${order_id}`,
        ]}
      />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Gönderen Bilgileri</h2>
            <label>Adınız, Soyadınız:</label>
            <input
              type="text"
              name="sender_name"
              placeholder="Örnek: Ahmet Türkylmaz"
              value={formData.sender_name}
              onChange={handleChange}
              required
            />

            <label>Adresinize Ait İl / İlçe:</label>
            <select
              name="sender_city"
              value={formData.sender_city}
              onChange={handleChange}
              required
            >
              <option value="">Şehir Seçiniz</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>

            <select
              name="sender_district"
              value={formData.sender_district}
              onChange={handleChange}
              required
            >
              <option value="">İlçe Seçiniz</option>
              {towns.map((town) => (
                <option key={town.town_id} value={town.town_id}>
                  {town.town_name}
                </option>
              ))}
            </select>

            <label>Kendi Adresiniz:</label>
            <textarea
              name="sender_address"
              placeholder="Örnek: Bahar Mah. Çiçek Sok. No:19 Kat:2 Daire:3"
              value={formData.sender_address}
              onChange={handleChange}
              required
            />

            <h2>Kargo Türü</h2>
            <ShipmentTypeRadio>
              {shipmentTypes.map((type, index) => (
                <RadioLabel key={index}>
                  <input
                    type="radio"
                    name="shipment_type"
                    value={type.type_name}
                    checked={formData.shipment_type === type.type_name}
                    onChange={handleChange}
                  />
                  {type.type_name} - {type.shipment_price} TL
                  <InfoButton
                    type="button"
                    onClick={() => showShipmentTypeInfo(type.type_description)}
                  >
                    Bilgi
                  </InfoButton>
                </RadioLabel>
              ))}
            </ShipmentTypeRadio>
          </div>

          <div className="form-section">
            <h2>Alıcı Bilgileri</h2>
            <label>Alıcının Adı, Soyadı:</label>
            <input
              type="text"
              name="receiver_name"
              placeholder="Örnek: Osman Oruç"
              value={formData.receiver_name}
              onChange={handleChange}
              required
            />

            <label>Alıcı Şehri:</label>
            <select
              name="receiver_city"
              value={formData.receiver_city}
              onChange={handleChange}
              required
            >
              <option value="">Şehir Seçiniz</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>

            <label>Alıcı Cezaevi:</label>
            <select
              name="jail_name"
              value={formData.jail_name}
              onChange={handleChange}
              required
            >
              <option value="">Cezaevi Seçiniz</option>
              {jails.map((jail) => (
                <option key={jail.id} value={jail.id}>
                  {jail.name}
                </option>
              ))}
            </select>

            <label>Alıcının Baba Adı:</label>
            <input
              type="text"
              name="father_name"
              placeholder="Örnek: Mehmet"
              value={formData.father_name}
              onChange={handleChange}
            />
            <div className="info-box">
              Kısaca giriniz. Bu bilgi karışıklığı azaltmak için istenir.
              Bilmiyorsanız boş bırakabilirsiniz.
            </div>

            <label>Koğuş Numarası:</label>
            <input
              type="text"
              name="ward_id"
              placeholder="Örnek: B10"
              value={formData.ward_id}
              onChange={handleChange}
            />
            <div className="info-box">
              Kısaca giriniz. Bu bilgi karışıklığı azaltmak için istenir.
              Bilmiyorsanız boş bırakabilirsiniz.
            </div>

            <label>Alıcı Telefon:</label>
            <input
              type="text"
              name="receiver_phone"
              placeholder="Örnek: 589 334 44 90"
              value={formData.receiver_phone}
              onChange={handleChange}
            />

            <label>Postaya Verileceği Tarih:</label>
            <input
              type="date"
              name="shipment_date"
              value={formData.shipment_date}
              onChange={handleChange}
              required
            />
            <div className="notice-box yellow">
              Yukarıdaki tarih mektubunuzun yola çıkabileceği en erken tarihtir.
              Bu tarih resmi tatile denk geliyorsa bir sonraki ilk iş gününde
              postaya verilecektir.
            </div>
            <div className="notice-box green">
              Hafta içi 14:00'a kadar vereceğiniz sipariş aynı gün yola
              çıkabilir. Resmi tatiller hariçtir.
            </div>
          </div>

          <div className="form-footer">
            <ContinueButton
              href={`/components/letterTypes/Control?order_id=${order_id}`}
            >
              Devam Et
            </ContinueButton>
          </div>
        </form>
      </div>
    </AnimationRevealPage>
  );
};

export default FormComponent;
