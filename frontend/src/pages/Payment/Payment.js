import axios from "axios";
import Header from "components/headers/light.js";
import { StepperWithContent } from "components/stepper/Stepper";
import { AnimatePresence, motion } from "framer-motion";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import { CreditCardIcon, PercentIcon, TagIcon, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto 20px;
  padding: 2rem;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  border-radius: 25px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Column = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrderSummary = styled.div`
  background-color: rgba(243, 232, 255, 0.6);
  padding: 1.5rem;
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const SummaryItemName = styled.p`
  font-weight: 600;
  color: #4a0072;
`;

const SummaryItemDetails = styled.p`
  font-size: 0.875rem;
  color: #666;
`;

const TotalSection = styled.div`
  border-top: 2px solid #d8b4fe;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-bottom: 2px solid #9333ea;
  background-color: transparent;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-bottom-color: #7e22ce;
  }

  &::placeholder {
    color: transparent;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    transform: translateY(-20px) scale(0.8);
    color: #7e22ce;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 0;
  top: 0.1rem;
  color: #9333ea;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const CardContainer = styled.div`
  margin-top: 2rem;
  margin-bottom: 25px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const TransferText = styled.div`
  background-color: rgba(243, 232, 255, 0.6);
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  color: #4a0072;
  font-weight: 500;
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #4a0072;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const RadioInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #9333ea;
  border-radius: 50%;
  outline: none;
  transition: all 0.3s ease;

  &:checked {
    background-color: #9333ea;
    box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.2);
  }

  &:hover {
    border-color: #7e22ce;
  }
`;

const PaymentButton = styled.button`
  width: 100%;
  background-color: #9333ea;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2rem;

  &:hover {
    background-color: #7e22ce;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const CouponInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #9333ea;
  border-radius: 5px;
`;

const CouponButton = styled.button`
  width: 100%;
  background-color: #7e22ce;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #6d28d9;
  }
`;

const CouponToggleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background-color: #9333ea;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #7e22ce;
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CouponSection = styled(motion.div)`
  background-color: rgba(243, 232, 255, 0.6);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
  overflow: hidden;
`;

const CouponList = styled(motion.div)`
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const CouponListItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-color: #9333ea;
  }
`;

const CouponDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CouponCode = styled.span`
  font-weight: bold;
  color: #4a0072;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CouponDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const CouponValidityDate = styled.div`
  color: #666;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CouponApplyButton = styled(motion.button)`
  background-color: #9333ea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #7e22ce;
  }

  &:disabled {
    background-color: #a8a8a8;
    cursor: not-allowed;
  }
`;

const CouponMessage = styled.div`
  margin-top: 1rem;
  color: ${(props) => (props.success ? "#10b981" : "#ef4444")};
  text-align: center;
`;

const PaymentPage = () => {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const BASE_URL = process.env.REACT_APP_API_URL
  const FRONTEND_PORT = process.env.FRONTEND_PORT
  const [orderData, setOrderData] = useState(null);
  const [envelopeColors, setEnvelopeColors] = useState([]);
  const [paperColors, setPaperColors] = useState([]);
  const [smells, setSmells] = useState([]);
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [updatedFields, setUpdatedFields] = useState({
    status: "Ödeme Bekleniyor - Kartla Ödeme",
    order_price: "0.00",
    tax: 0.0,
    discount: 0.0,
  });
  const order_id = searchParams.get("order_id");
  const token = localStorage.getItem("token");
  const [isCouponSectionOpen, setIsCouponSectionOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  const [, setIsAnimating] = useState(false);

  const fetchUserCoupons = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setUserCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Error fetching user coupons:", error);
      setCouponMessage("Kuponlar yüklenirken bir hata oluştu.");
    }
  };

  const validateCoupon = async (couponToValidate) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/validate_coupon`,
        null,
        {
          params: {
            coupon_code: couponToValidate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const couponData = response.data;

      if (couponData.status === "exists") {
        setAppliedCoupon(couponData.coupon);
        setCouponMessage(`Kupon (${couponToValidate}) başarıyla uygulandı!`);
      } else {
        setCouponMessage("Geçersiz kupon kodu.");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponMessage("Kupon doğrulaması sırasında bir hata oluştu.");
      setAppliedCoupon(null);
    }
  };

  // Modify existing coupon opening function
  const handleCouponSectionToggle = () => {
    setIsAnimating(true);

    setIsCouponSectionOpen(!isCouponSectionOpen);

    // Fetch user coupons when opening the section
    if (!isCouponSectionOpen) {
      fetchUserCoupons();
    }
  };

  useEffect(() => {
    // Fetch Order Data
    const fetchOrderData = async () => {
      const response = await fetch(`${BASE_URL}/order/${order_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrderData(data);
    };

    // Fetch Envelope Colors
    const fetchEnvelopeColors = async () => {
      const response = await fetch(`${BASE_URL}/envelope_colors`);
      const data = await response.json();
      setEnvelopeColors(data);
    };

    // Fetch Paper Colors
    const fetchPaperColors = async () => {
      const response = await fetch(`${BASE_URL}/paper_colors`);
      const data = await response.json();
      setPaperColors(data);
    };

    // Fetch Smells
    const fetchSmells = async () => {
      const response = await fetch(`${BASE_URL}/envelope_smell`);
      const data = await response.json();
      setSmells(data);
    };

    // Fetch Shipment Types
    const fetchShipmentTypes = async () => {
      const response = await fetch(`${BASE_URL}/shipment_type`);
      const data = await response.json();
      setShipmentTypes(data);
    };

    // Fetch Other Prices
    const fetchOtherPrices = async () => {
      const response = await fetch(`${BASE_URL}/prices`);
      const data = await response.json();
      console.log(data);
      setPrices(data);
    };

    fetchOrderData();
    fetchEnvelopeColors();
    fetchPaperColors();
    fetchSmells();
    fetchShipmentTypes();
    fetchOtherPrices();
  }, [order_id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      const formattedNumber = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setCardData((prev) => ({ ...prev, [name]: formattedNumber }));
    } else if (name === "expiry") {
      // Format expiry date (MM/YY) - insert / after two digits
      let formattedExpiry = value.replace(/\D/g, ""); // Remove all non-numeric characters
      if (formattedExpiry.length >= 2) {
        formattedExpiry = `${formattedExpiry.slice(
          0,
          2
        )}/${formattedExpiry.slice(2, 4)}`;
      }
      setCardData((prev) => ({ ...prev, [name]: formattedExpiry }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (e) => {
    setCardData((prev) => ({ ...prev, focus: e.target.name }));
  };

  const getPriceDetails = (value, options) => {
    const foundOption = options.find(
      (option) =>
        option.color_code === value ||
        option.smell_name === value ||
        option.type_name === value ||
        option.price_name === value
    );
    return foundOption
      ? {
          name:
            foundOption.color_name ||
            foundOption.smell_name ||
            foundOption.type_name ||
            foundOption.price_name,
          price:
            foundOption.color_price ||
            foundOption.smell_price ||
            foundOption.shipment_price ||
            foundOption.price_value,
        }
      : { name: "", price: "0.00" };
  };

  // Function to clean HTML tags from envelope_text
  const cleanText = (text) => {
    const cleanedText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Regular expression to remove HTML tags
    return cleanedText;
  };

  const handlePaymentMethodChange = (e) => {
    const selectedPaymentMethod = e.target.value;
    setPaymentMethod(selectedPaymentMethod);
  };

  // Clean envelope_text before calculating
  const cleanEnvelopeText = cleanText(orderData?.envelope_text || "");

  const orderSummary = [
    {
      name: "Mektup Uzunluğu",
      details: `Karakter Sayısı: ${cleanEnvelopeText.length || 0}`,
      price:
        (parseFloat(
          (cleanEnvelopeText.length / 2) *
            getPriceDetails("character_price", prices).price
        ).toFixed(2) || "0.00") + " TL",
    },
    {
      name: "Zarf Seçimi",
      details: `Zarf Rengi: ${
        getPriceDetails(orderData?.envelope_color, envelopeColors).name
      }`,
      price:
        getPriceDetails(orderData?.envelope_color, envelopeColors).price +
        " TL",
    },
    {
      name: "Kağıt Seçimi",
      details: `Kağıt Rengi: ${
        getPriceDetails(orderData?.paper_color, paperColors).name
      }`,
      price: getPriceDetails(orderData?.paper_color, paperColors).price + " TL",
    },
    {
      name: "Kartpostal Ekleme",
      details: `Toplam: ${orderData?.cardpostals.length || 0}`,
      price: `${
        orderData?.cardpostals.length > 0
          ? orderData?.cardpostals.length *
            getPriceDetails("cardpostal_price", prices).price
          : "0.00"
      } TL`,
    },
    {
      name: "Fotoğraf Ekleme",
      details: `Toplam: ${orderData?.photos.length || 0}`,
      price: `${
        orderData?.photos.length > 0
          ? orderData?.photos.length *
            getPriceDetails("photo_price", prices).price
          : "0.00"
      } TL `,
    },
    ...(orderData?.files?.length > 0
      ? [
          {
            name: "Belge Ekleme",
            details: `Toplam: ${orderData?.files.length || 0}`,
            price: `${
              orderData?.files.length > 0
                ? orderData?.files.length *
                  getPriceDetails("file_price", prices).price
                : "0.00"
            } TL `,
          },
        ]
      : []),
    {
      name: "Mektup Kokusu",
      details: `Koku: ${getPriceDetails(orderData?.smell, smells).name}`,
      price: getPriceDetails(orderData?.smell, smells).price + " TL",
    },
    {
      name: "Postalama Türü",
      details: `Tür: ${
        getPriceDetails(orderData?.shipment_type, shipmentTypes).name
      }`,
      price:
        getPriceDetails(orderData?.shipment_type, shipmentTypes).price + " TL",
    },
  ];

  const calculateDiscountedOrderSummary = () => {
    let summary = [...orderSummary];
    let totalDiscount = 0;

    if (appliedCoupon) {
      // Apply discount rate
      if (appliedCoupon.discount_rate > 0) {
        const discountAmount =
          totalAmount * (appliedCoupon.discount_rate / 100);
        totalDiscount += discountAmount;
      }

      // Remove smell price if smell_discount is true
      if (appliedCoupon.smell_discount) {
        const smellItemIndex = summary.findIndex(
          (item) => item.name === "Mektup Kokusu"
        );
        if (smellItemIndex !== -1) {
          totalDiscount += parseFloat(summary[smellItemIndex].price);
          summary[smellItemIndex].price = "0.00 TL";
        }
      }

      // Adjust photo and cardpostal quantities
      if (appliedCoupon.photo_discount > 0) {
        const photoIndex = summary.findIndex(
          (item) => item.name === "Fotoğraf Ekleme"
        );
        if (photoIndex !== -1) {
          const currentPhotos = orderData?.photos.length || 0;
          const reducedPhotos = Math.max(
            0,
            currentPhotos - appliedCoupon.photo_discount
          );
          summary[photoIndex].details = `Toplam: ${currentPhotos}`;
          summary[photoIndex].price = `${
            reducedPhotos * getPriceDetails("photo_price", prices).price
          } TL`;
          totalDiscount += parseFloat(summary[photoIndex].price);
        }
      }

      if (appliedCoupon.cardpostal_discount > 0) {
        const cardpostalIndex = summary.findIndex(
          (item) => item.name === "Kartpostal Ekleme"
        );
        if (cardpostalIndex !== -1) {
          const currentCardpostals = orderData?.cardpostals.length || 0;
          const reducedCardpostals = Math.max(
            0,
            currentCardpostals - appliedCoupon.cardpostal_discount
          );
          summary[cardpostalIndex].details = `Toplam: ${currentCardpostals}`;
          summary[cardpostalIndex].price = `${
            reducedCardpostals *
            getPriceDetails("cardpostal_price", prices).price
          } TL`;
          totalDiscount += parseFloat(summary[cardpostalIndex].price);
        }
      }
    }

    return { summary, totalDiscount };
  };

  const { summary: modifiedOrderSummary, totalDiscount } =
    calculateDiscountedOrderSummary();

  // Recalculate total amounts with discount
  const totalAmount = modifiedOrderSummary.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0
  );
  const totalTax = (
    (totalAmount * getPriceDetails("tax_rate", prices).price) /
    100
  ).toFixed(2);
  const totalWithTax = (totalAmount + parseFloat(totalTax)).toFixed(2);

    useEffect(() => {
      if (paymentMethod) {
        console.log("Payment method changed:", paymentMethod);
        setUpdatedFields((prev) => ({
          ...prev,
          status:
            paymentMethod === "card"
              ? "Ödeme Bekleniyor - Kredi Kartı"
              : "Ödeme Bekleniyor - Transfer",
        }));
      }
    }, [paymentMethod]);

    const handlePayment = () => {
      console.log("Ödeme işlemi başlatıldı");

      // Update updatedFields with precise order details before payment
      setUpdatedFields((prev) => ({
        ...prev,
        order_price: parseFloat(totalWithTax),
        tax: parseFloat(totalTax),
        discount: appliedCoupon ? 1.0 : 0.0,
      }));

      console.log(updatedFields); // Güncel `updatedFields` değeri loglanır
      updateOrder();
    };

    const updateOrder = async () => {
      try {
        const putResponse = await axios.put(
          `${BASE_URL}/order/${order_id}`,
          updatedFields,
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

  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
      <StepperWithContent
        activeStep={3}
        links={[
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Jail?order_id=${order_id}`,
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/DetailsPage?order_id=${order_id}`,
          `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Control?order_id=${order_id}`,
        ]}
      />
      <Container>
        <Card>
          <FlexContainer>
            <Column>
              <Title>Sipariş Özeti</Title>
              <OrderSummary>
                {modifiedOrderSummary.map((item, index) => (
                  <SummaryItem key={index}>
                    <div>
                      <SummaryItemName>{item.name}</SummaryItemName>
                      <SummaryItemDetails>{item.details}</SummaryItemDetails>
                    </div>
                    <p>{item.price}</p>
                  </SummaryItem>
                ))}
                <TotalSection>
                  {appliedCoupon && (
                    <SummaryItem>
                      <p>İndirim</p>
                      <p>-{totalDiscount.toFixed(2)} TL</p>
                    </SummaryItem>
                  )}
                  <SummaryItem>
                    <p>Toplam Vergi Tutarı</p>
                    <p>{totalTax} TL</p>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryItemName>Ödenecek Tutar</SummaryItemName>
                    <SummaryItemName>{totalWithTax} TL</SummaryItemName>
                  </SummaryItem>
                </TotalSection>
              </OrderSummary>

              <CouponToggleButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCouponSectionToggle}
              >
                <Ticket size={20} />
                Kupon Kullan
              </CouponToggleButton>

              <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
                {isCouponSectionOpen && (
                  <CouponSection
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        duration: 0.2,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <CouponInput
                      placeholder="Kupon kodunuzu girin"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <CouponButton onClick={() => validateCoupon(couponCode)}>
                      Kuponu Uygula
                    </CouponButton>
                    {couponMessage && (
                      <CouponMessage success={appliedCoupon}>
                        {couponMessage}
                      </CouponMessage>
                    )}

                    <CouponList
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: {
                          delay: 0.2,
                          duration: 0.3,
                        },
                      }}
                    >
                      {userCoupons.map((coupon, index) => (
                        <CouponListItem
                          key={index}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: 0.1 * index,
                              duration: 0.3,
                            },
                          }}
                        >
                          <CouponDetails>
                            <CouponCode>
                              <TagIcon size={16} />
                              {coupon.coupon_code}
                            </CouponCode>
                            <CouponDescription>
                              {coupon.discount_description}
                            </CouponDescription>
                            <CouponValidityDate>
                              <PercentIcon size={14} />
                              Son Kullanım Tarihi:{" "}
                              {new Date(coupon.end_date).toLocaleDateString()}
                            </CouponValidityDate>
                          </CouponDetails>
                          <CouponApplyButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => validateCoupon(coupon.coupon_code)}
                            disabled={!coupon.is_active}
                          >
                            <CreditCardIcon size={16} />
                            Kullan
                          </CouponApplyButton>
                        </CouponListItem>
                      ))}
                    </CouponList>
                  </CouponSection>
                )}
              </AnimatePresence>
            </Column>

            <Column>
              <Title>Ödeme Yöntemi</Title>
              <RadioContainer>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={handlePaymentMethodChange}
                  />
                  Banka Transferi
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={handlePaymentMethodChange}
                  />
                  Kartla Ödeme
                </RadioLabel>
              </RadioContainer>

              {paymentMethod === "transfer" ? (
                <TransferText>
                  Banka Transfer Bilgileri:
                  <br />
                  Hesap Adı: Example Bank
                  <br />
                  IBAN: TR00 0000 0000 0000 0000 0000
                  <br />
                  Açıklama: Sipariş Numarası {order_id}
                </TransferText>
              ) : (
                <>
                  <Title>Kartla Ödeme</Title>
                  <CardContainer>
                    <Cards
                      number={cardData.number}
                      name={cardData.name}
                      expiry={cardData.expiry}
                      cvc={cardData.cvc}
                      focused={cardData.focus}
                      placeholders={{ name: "Kart Sahibi" }}
                      locale={{ valid: "Geçerli Tarih" }}
                    />
                  </CardContainer>
                  <Form>
                    <InputGroup>
                      <Input
                        type="text"
                        name="number"
                        placeholder="Kart Numarası"
                        value={cardData.number}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        maxLength={19}
                      />
                      <Label>Kart Numarası</Label>
                    </InputGroup>
                    <InputGroup>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Kart Sahibi Adı Soyadı"
                        value={cardData.name}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                      <Label>Kart Sahibi Adı Soyadı</Label>
                    </InputGroup>
                    <div style={{ display: "flex", gap: "3.5rem" }}>
                      <InputGroup>
                        <Input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          maxLength={5}
                        />
                        <Label>Son Kullanma Tarihi</Label>
                      </InputGroup>
                      <InputGroup>
                        <Input
                          type="text"
                          name="cvc"
                          placeholder="CVC"
                          value={cardData.cvc}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          maxLength={3}
                        />
                        <Label>CVC</Label>
                      </InputGroup>
                    </div>
                  </Form>
                </>
              )}
              <PaymentButton onClick={handlePayment}>Ödeme Yap</PaymentButton>
            </Column>
          </FlexContainer>
        </Card>
      </Container>
    </AnimationRevealPage>
  );
};

export default PaymentPage;
