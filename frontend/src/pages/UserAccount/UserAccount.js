import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Footer from "components/footers/FiveColumnWithBackground.js";
import Header from "components/headers/light.js";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import tw, { styled } from "twin.macro";


const Container = styled.div`
  ${tw`min-h-screen flex flex-col items-center text-white`}
`;

const MainContent = styled.div`
  ${tw`flex flex-col lg:flex-row justify-center gap-10 mt-6`}
`;

const Sidebar = styled.div`
  ${tw`bg-purple-600 p-6 rounded-md w-full max-w-sm lg:max-w-xs shadow-xl`}
  ul {
    ${tw`space-y-4`}
  }
  li {
    ${tw`flex items-center text-lg cursor-pointer hover:bg-gray-700 p-2 rounded-md transition duration-300`}
  }
  svg {
    ${tw`w-6 h-6 mr-3`}
  }
`;

const AccountDetails = styled.div`
  ${tw`bg-purple-800 p-8 rounded-md w-full max-w-lg shadow-xl`}
`;

const Label = styled.label`
  ${tw`block text-sm text-gray-400 mb-1`}
`;

const Input = styled.input`
  ${tw`w-full p-2 bg-gray-600 rounded-md text-white mb-4`}
  &:focus {
    ${tw`outline-none border-2 border-red-400`}
  }
`;

const InfoText = styled.p`
  ${tw`text-xs text-gray-500 mt-1`}
`;

const Button = styled.button`
  ${tw`bg-blue-500 text-black py-2 px-6 rounded-md hover:bg-blue-300 mr-4`}
`;

const DeleteButton = styled.button`
  ${tw`bg-red-600 py-2 px-4 rounded-md mt-4 text-white hover:bg-red-700`}
`;

const AccountHeader = styled.h2`
  ${tw`text-2xl font-semibold mb-6 text-white`}
`;

const TableContainer = styled.div`
  ${tw` p-8 rounded-md w-full`}
`;

const TableHeader = styled.h2`
  ${tw`text-2xl font-semibold mb-6`}
`;

const Table = styled.table`
  ${tw`table-auto w-full text-gray-700`}
`;

const TableHeaderCell = styled.th`
  ${tw`border px-4 py-2`}
`;

const TableCell = styled.td`
  ${tw`border px-4 py-2`}
`;

const DeleteLink = styled.button`
  ${tw`text-red-600 hover:underline px-3 py-1 bg-red-100 rounded-md hover:bg-red-200 transition duration-300`}
`;

const EditLink = styled.button`
  ${tw`text-blue-600 hover:underline px-3 py-1 bg-blue-100 rounded-md ml-2 hover:bg-blue-200 transition duration-300`}
`;

const SelectedPage = styled.div`
  ${tw`w-full max-w-3xl mt-12 shadow-xl bg-gray-100`}
`;

const ChangePasswordContainer = styled.div`
  ${tw`bg-purple-600 p-8 rounded-md w-full shadow-xl mb-10`}
`;

const AddCouponButton = styled.button`
  ${tw`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mb-4`}
`;

const AddCouponModal = styled.div`
  ${tw`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
`;

const ModalContent = styled.div`
  ${tw`bg-white p-6 rounded-lg shadow-xl w-96`}
`;

const ModalInput = styled.input`
  ${tw`w-full p-2 border rounded-md mb-4 text-black`}
`;

const ModalButton = styled.button`
  ${tw`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-2`}
`;

const ModalCloseButton = styled.button`
  ${tw`bg-red-500 text-white py-2 px-4 mr-3 rounded-md hover:bg-red-600`}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  color: black;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
    &:hover {
      color: white
    }
`;

const PageInfo = styled.span`
  margin: 0 10px;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusButton = styled.button`
  ${tw`text-blue-600 hover:underline px-3 py-1 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-300 flex items-center`}
`;

const ExpandableRow = styled.tr`
  ${tw`transition-all duration-300 ease-in-out`}
`;

const DetailsCell = styled.td`
  ${tw`p-4 bg-gray-100 transition-all duration-300 ease-in-out`}
`;

const StepperContainer = styled.div`
  ${tw`flex items-center justify-between mb-4 relative`}

  &::before {
    content: "";
    ${tw`absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0`}
    width:90%;
    margin-left: 5%;

    /* Çizginin uzunluğunu ve konumunu kısaltma */
    ${({ $activeSteps }) =>
      $activeSteps &&
      `background: linear-gradient(to right, #48bb78 ${$activeSteps}%, #e2e8f0 ${$activeSteps}%)`};

    /* Çizginin alt kısmındaki mesafeyi biraz daha yukarıya çekme */
    top: 35%; /* Konumu biraz daha yukarıya çekiyoruz */
  }
`;


const Step = styled.div`
  ${tw`flex flex-col items-center relative z-10`}

  ${({ $active }) =>
    $active &&
    `svg {
      color: green;
    }
  `}
`;

const StepIcon = styled.div`
  ${tw`w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 bg-white relative z-10`}

  ${({ $active }) =>
    $active ? tw`border-green-500 bg-green-100` : tw`border-gray-300 bg-white`}
`;

const StepInfo = styled.div`
  ${tw`text-center mt-2 text-sm`}
`;


const DeliveryInfoGrid = styled.div`
  ${tw`grid grid-cols-2 gap-4 mt-4`}
`;

const DeliveryInfoItem = styled.div`
  ${tw`bg-white p-3 rounded-md shadow-sm`}
  h3 {
    ${tw`font-semibold text-gray-700 mb-1 text-sm`}
  }
  p {
    ${tw`text-gray-600 text-sm`}
  }
`;

const TrackingLink = styled.a`
  ${tw`bg-green-500 text-white mt-4 py-2 px-4 rounded-md hover:bg-green-600 inline-flex items-center text-sm w-full text-center justify-center`}
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ReadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

const UserAccountPage = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const FRONTEND_PORT = process.env.FRONTEND_PORT
  const [selectedPage, setSelectedPage] = useState("Gönderilenler");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token"); // Token'ı localStorage'dan al
  const [changedData, setChangedData] = useState({});

  const normalizeText = (text) => {
    const turkishMap = {
      ç: "c",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
      Ç: "c",
      Ğ: "g",
      İ: "i",
      Ö: "o",
      Ş: "s",
      Ü: "u",
    };
    return text
      .split("")
      .map((char) => turkishMap[char] || char) // Türkçe karakterleri değiştir
      .join("")
      .toLowerCase() // Büyük harfleri küçük harfe çevir
      .replace(/ /g, "_"); // Boşlukları `_` ile değiştir
  };

  // Sayfa değişimi için işlev
  const handlePageChange = (pageName) => {
    const normalizedPageName = normalizeText(pageName); // Sayfa adını normalize et
    setSelectedPage(pageName); // Sayfa adını güncelle

    // Mevcut URL'yi al ve hash ekle
    const baseUrl = window.location.pathname;
    const newUrl = `${baseUrl}#${normalizedPageName}`;
    window.history.pushState({}, "", newUrl); // Hash ile URL'yi güncelle
  };

  useEffect(() => {
    const hash = window.location.hash; // Hash kısmını al (# ile başlar)
    const pageName = hash ? hash.substring(1) : ""; // `#` işaretini kaldır

    // Geçerli sayfa adlarını tanımla
    const validPages = [
      "gonderilenler",
      "gonderilmeyenler",
      "indirim_kuponlarim",
      "sifremi_degistir",
    ];

    console.log(pageName);

    if (validPages.includes(pageName)) {
      setSelectedPage(pageName); // Geçerli bir hash varsa, sayfayı ayarla
    } else {
      setSelectedPage("Gönderilenler"); // Varsayılan sayfa
    }
  }, []); // Bu efekt sadece sayfa ilk yüklendiğinde çalışır

  // selectedPage değiştiğinde çalışacak effect
  useEffect(() => {
    console.log(selectedPage); // Bu `useEffect`, selectedPage değiştiğinde çalışacak
  }, [selectedPage]);

  // Kaydet tuşuna basıldığında değişen alanları backend'e gönderiyoruz
  const handleSave = async () => {
    try {
      if (Object.keys(changedData).length > 0) {
        await axios.put(`${BASE_URL}/update_user_info`, changedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Bilgiler başarıyla güncellendi!");
        setChangedData({});
      } else {
        alert("Herhangi bir değişiklik yapılmadı.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete_user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Kullanıcı başarıyla silindi.");
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href =
            `${BASE_URL}:${FRONTEND_PORT}/components/landingPages/SaaSProductLandingPage`;
        }, 3000); // 3 saniye bekle ve yönlendir
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Hesap silinirken bir hata oluştu.");
    }
  };

  // Function to handle order deletion
  const handleOrderDelete = async (orderId) => {
    try {
      await axios.delete(`${BASE_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Sipariş başarıyla silindi");
      // Update orders state by removing the deleted order
      setOrders(orders.filter((order) => order.customer_id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Sipariş silinirken bir hata oluştu");
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
    setChangedData((prevChangedData) => ({
      ...prevChangedData,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.user);
        setOrders(response.data.orders || []); // Store orders in state
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (loading) {
    return <></>;
  }

  const renderSelectedPage = () => {
    const sentOrders = orders.filter(
      (order) =>
        order.status !== "Sipariş Bekleniyor" &&
        order.status !== "Ödeme Bekleniyor" &&
        order.status !== "Sipariş Oluşturuldu"
    );
    const unsentOrders = orders.filter(
      (order) =>
        order.status === "Sipariş Bekleniyor" ||
        order.status === "Ödeme Bekleniyor"
    );

    switch (selectedPage) {
      case "gonderilenler":
        return <SentItems orders={sentOrders} />;
      case "gonderilmeyenler":
        return (
          <UnsentItems orders={unsentOrders} onDelete={handleOrderDelete} />
        );
      case "sifremi_degistir":
        return <ChangePasswordForm />;
      case "indirim_kuponlarim":
        return <Coupons />;
      default:
        return <SentItems orders={sentOrders} />;
    }
  };

  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />

      <Container>
        <MainContent>
          {/* Sidebar */}
          <Sidebar>
            <ul>
              <li onClick={() => handlePageChange("gonderilenler")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M3 6h18M3 14h18M3 18h18"
                  />
                </svg>
                Gönderilenler
              </li>
              <li onClick={() => handlePageChange("gonderilmeyenler")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
                Gönderilmeyenler
              </li>
              <li onClick={() => alert("Mektup Sayaç sayfasına git!")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c2.28 0 4 1.72 4 4s-1.72 4-4 4-4-1.72-4-4 1.72-4 4-4zm0 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Mektup Sayaç
              </li>
              <li onClick={() => handlePageChange("indirim_kuponlarim")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18V6h12v12H6zm3-3h6m-6-4h6"
                  />
                </svg>
                İndirim Kuponlarım
              </li>
              <li onClick={() => alert("Paylaş & Kazan sayfasına git!")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v16h16V4H4zm4 8h8"
                  />
                </svg>
                Paylaş & Kazan
              </li>
              <li onClick={() => alert("Talimatlarım sayfasına git!")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 11l7-7 7 7m0 6v5H5v-5"
                  />
                </svg>
                Talimatlarım
              </li>
              <li onClick={() => handlePageChange("sifremi_degistir")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11V8m0 7v1m0-4h.01M12 3a9 9 0 11-9 9 9 9 0 019-9z"
                  />
                </svg>
                Şifremi Değiştir
              </li>
            </ul>
          </Sidebar>

          {/* Account Details */}
          <AccountDetails>
            <AccountHeader>Hesabım</AccountHeader>

            <Label>Adınız</Label>
            <Input
              type="text"
              value={userData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <Label>Soyadınız</Label>
            <Input
              type="text"
              value={userData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
            />

            <Label>E-posta Adresiniz</Label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />

            <Label>Telefon Numaranız</Label>
            <Input
              type="text"
              value={userData.phone_number}
              onChange={(e) =>
                handleInputChange("phone_number", e.target.value)
              }
            />
            <InfoText>
              Numaranızı değiştirmeniz durumunda tekrar SMS ile numara onayı
              istenecektir.
            </InfoText>

            <p className="text-gray-400 mt-4">
              Kayıt Tarihiniz:{" "}
              <span className="text-gray-300">
                {new Date(userData.join_date).toLocaleString()}
              </span>
            </p>

            <Button onClick={handleSave}>Kaydet</Button>

            <DeleteButton onClick={handleDeleteAccount}>
              Hesabımı Sil
            </DeleteButton>
          </AccountDetails>
        </MainContent>

        {/* Display Selected Page */}
        <SelectedPage>{renderSelectedPage()}</SelectedPage>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};

const EyeIcon = styled.span`
  cursor: pointer;
  margin-left: -30px; // Göz simgesinin yerleşimini ayarlamak için
  padding-top: 10px;
`;

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler uyuşmuyor!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/update_password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Şifre başarıyla güncellendi.");
      } else {
        alert(data.detail.error || "Şifre güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Şifre güncellenirken bir hata oluştu.");
    }
  };

  return (
    <ChangePasswordContainer>
      <AccountHeader>Şifre Değiştir</AccountHeader>
      <form onSubmit={handleSubmit}>
        <Label>Eski Şifre</Label>
        <Input
          type={showOldPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <EyeIcon onClick={() => setShowOldPassword(!showOldPassword)}>
          {showOldPassword ? "🙈" : "👁️"}
        </EyeIcon>

        <Label>Yeni Şifre</Label>
        <Input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)}>
          {showNewPassword ? "🙈" : "👁️"}
        </EyeIcon>

        <Label>Yeni Şifre (Tekrar)</Label>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? "🙈" : "👁️"}
        </EyeIcon>

        <Button type="submit">Değiştir</Button>
      </form>
    </ChangePasswordContainer>
  );
};

const SentItems = ({ orders, onEdit }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("date"); // Default sorting by date
  const [sortOrder, setSortOrder] = useState("desc"); // Default descending order
  const itemsPerPage = 10;

  const handleStatusClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getCurrentStep = (status) => {
    switch (status) {
      case "Hazırlanıyor":
        return 0;
      case "Gönderildi":
        return 1;
      case "Teslim Edildi":
        return 2;
      default:
        return 3;
    }
  };

  const getActiveSteps = (status) => {
    const currentStep = getCurrentStep(status);
    return currentStep === 0 ? 0 : currentStep * 50;
  };

  // Sort orders by selected key and order
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortKey === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortKey === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Get current page orders
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle sorting
  const handleSort = (key) => {
    if (sortKey === key) {
      // If already sorting by the same key, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort key and default order
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to the first page after sorting
  };

  return (
    <TableContainer>
      <TableHeader>Gönderilenler</TableHeader>
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>
              <SortButton onClick={() => handleSort("date")}>
                Tarih{" "}
                {sortKey === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </SortButton>
            </TableHeaderCell>
            <TableHeaderCell>Alıcı</TableHeaderCell>
            <TableHeaderCell>Mektup Tipi</TableHeaderCell>
            <TableHeaderCell>
              <SortButton onClick={() => handleSort("status")}>
                Durum{" "}
                {sortKey === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </SortButton>
            </TableHeaderCell>
            <TableHeaderCell>İşlem</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <>
                <ExpandableRow key={index}>
                  <TableCell>
                    {new Date(order.date).toLocaleString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {`${order.receiver_name} ${order.receiver_surname}`}
                  </TableCell>
                  <TableCell>{order.letter_type}</TableCell>
                  <TableCell>
                    <StatusButton onClick={() => handleStatusClick(order.id)}>
                      {order.status}
                      {expandedOrderId === order.id ? (
                        <ChevronUp tw="ml-2" />
                      ) : (
                        <ChevronDown tw="ml-2" />
                      )}
                    </StatusButton>
                  </TableCell>
                  <TableCell>
                    <ActionContainer>
                      {order.status !== "Gönderildi" &&
                        order.status !== "Teslim Edildi" && (
                          <EditLink
                            onClick={ () =>
                              (window.location.href = `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Jail?order_id=${order.id}`)
                            }
                          >
                            Düzenle
                          </EditLink>
                        )}
                      <ReadButton
                        onClick={() =>
                          (window.location.href = `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/JailDisabled?order_id=${order.id}`)
                        }
                      >
                        Oku
                      </ReadButton>
                    </ActionContainer>
                  </TableCell>
                </ExpandableRow>
                {expandedOrderId === order.id && (
                  <tr>
                    <DetailsCell colSpan="5">
                      <StepperContainer
                        $activeSteps={getActiveSteps(order.status)}
                      >
                        <Step $active={getCurrentStep(order.status) >= 0}>
                          <StepIcon $active={getCurrentStep(order.status) >= 0}>
                            <Clock
                              size={30}
                              color={
                                getCurrentStep(order.status) >= 0
                                  ? "green"
                                  : "gray"
                              }
                            />
                          </StepIcon>
                          <StepInfo>Hazırlanıyor</StepInfo>
                        </Step>
                        <Step $active={getCurrentStep(order.status) >= 1}>
                          <StepIcon $active={getCurrentStep(order.status) >= 1}>
                            <Truck
                              size={30}
                              color={
                                getCurrentStep(order.status) >= 1
                                  ? "green"
                                  : "gray"
                              }
                            />
                          </StepIcon>
                          <StepInfo>Gönderildi</StepInfo>
                        </Step>
                        <Step $active={getCurrentStep(order.status) >= 2}>
                          <StepIcon $active={getCurrentStep(order.status) >= 2}>
                            <CheckCircle
                              size={30}
                              color={
                                getCurrentStep(order.status) >= 2
                                  ? "green"
                                  : "gray"
                              }
                            />
                          </StepIcon>
                          <StepInfo>Teslim Edildi</StepInfo>
                        </Step>
                      </StepperContainer>

                      <DeliveryInfoGrid>
                        <DeliveryInfoItem>
                          <h3>Teslimat Durumu</h3>
                          <p>{order.status}</p>
                        </DeliveryInfoItem>
                        <DeliveryInfoItem>
                          <h3>Gönderi Takip Kodu</h3>
                          <p>TR{Math.floor(Math.random() * 1000000)}</p>
                        </DeliveryInfoItem>
                      </DeliveryInfoGrid>

                      <div tw="flex justify-end mt-4">
                        <TrackingLink
                          href={`https://tracking.example.com/${Math.floor(
                            Math.random() * 1000000
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Gönderi Takip Linki</span>{" "}
                          <i
                            className="fa-solid fa-arrow-up-right-from-square"
                            style={{ marginLeft: "4px" }}
                          />
                        </TrackingLink>
                      </div>
                    </DetailsCell>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <TableCell colSpan="5">Gönderilen sipariş bulunamadı</TableCell>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      {orders.length > itemsPerPage && (
        <Pagination>
          <PageButton disabled={currentPage === 1} onClick={handlePreviousPage}>
            Önceki
          </PageButton>
          <PageInfo>
            Sayfa {currentPage} / {totalPages}
          </PageInfo>
          <PageButton
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Sonraki
          </PageButton>
        </Pagination>
      )}
    </TableContainer>
  );
};

const UnsentItems = ({ orders, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("date"); // Default sorting by date
  const [sortOrder, setSortOrder] = useState("desc"); // Default descending order
  const itemsPerPage = 10;

  // Strip HTML Tags
  const stripHTMLTags = (text) => text.replace(/<\/?[^>]+(>|$)/g, "");

  // Sort orders by selected key and order
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortKey === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortKey === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Get current page orders
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle sorting
  const handleSort = (key) => {
    if (sortKey === key) {
      // If already sorting by the same key, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort key and default order
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to the first page after sorting
  };

  return (
    <TableContainer>
      <TableHeader>Gönderilmeyenler</TableHeader>
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>
              <SortButton onClick={() => handleSort("date")}>
                Tarih{" "}
                {sortKey === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </SortButton>
            </TableHeaderCell>
            <TableHeaderCell>Mektup Metni</TableHeaderCell>
            <TableHeaderCell>
              <SortButton onClick={() => handleSort("status")}>
                Durum{" "}
                {sortKey === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </SortButton>
            </TableHeaderCell>
            <TableHeaderCell>İşlem</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={index}>
                <TableCell>
                  {new Date(order.date).toLocaleString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {stripHTMLTags(order.envelope_text).slice(0, 20)}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <DeleteLink onClick={() => onDelete(order.id)}>
                    Sil
                  </DeleteLink>
                  <EditLink
                    onClick={() =>
                      (window.location.href = `${BASE_URL}:${FRONTEND_PORT}/components/letterTypes/Jail?order_id=${order.id}`)
                    }
                  >
                    Düzenle
                  </EditLink>
                </TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell colSpan="4">Bekleyen sipariş bulunamadı</TableCell>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      {orders.length > itemsPerPage && (
        <Pagination>
          <PageButton disabled={currentPage === 1} onClick={handlePreviousPage}>
            Önceki
          </PageButton>
          <PageInfo>
            Sayfa {currentPage} / {totalPages}
          </PageInfo>
          <PageButton
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Sonraki
          </PageButton>
        </Pagination>
      )}
    </TableContainer>
  );
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const token = localStorage.getItem("token");

  // Fetch coupons when the component mounts
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/coupons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success") {
          setCoupons(response.data.coupons);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [token]);

  const handleAddCoupon = async () => {
    // Validate coupon code: no spaces, no Turkish characters
    const turkishChars = /[ğüşıöçĞÜŞİÖÇ]/;
    const hasSpaces = /\s/;

    if (hasSpaces.test(newCouponCode)) {
      alert("Kupon kodunda boşluk kullanılamaz!");
      return;
    }

    if (turkishChars.test(newCouponCode)) {
      alert("Kupon kodunda Türkçe karakter kullanılamaz!");
      return;
    }

    // Ensure the token is present
    if (!token) {
      alert("Kullanıcı giriş yapmamış, lütfen giriş yapın.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/add_coupon?coupon_code=${newCouponCode}`, // Do not use query params here, send the coupon code in the body
        {}, // Send coupon code in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );

      if (response.data.status === "success") {
        // Refresh coupons list
        const updatedCouponsResponse = await axios.get(
          `${BASE_URL}/coupons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updatedCouponsResponse.data.status === "success") {
          setCoupons(updatedCouponsResponse.data.coupons);
        }

        alert("Kupon başarıyla eklendi!");
        setNewCouponCode("");
        setShowAddCouponModal(false);
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.detail || "Kupon eklenirken bir hata oluştu."
        );
      } else {
        alert("Kupon eklenirken bir hata oluştu.");
      }
    }
  };

  return (
    <TableContainer>
      <div tw="flex justify-between items-center mb-4">
        <TableHeader>İndirim Kuponlarım</TableHeader>
        <AddCouponButton onClick={() => setShowAddCouponModal(true)}>
          Kupon Ekle
        </AddCouponButton>
      </div>

      {showAddCouponModal && (
        <AddCouponModal>
          <ModalContent>
            <h2 tw="text-xl font-bold mb-10">Kupon Ekle</h2>
            <ModalInput
              placeholder="Kupon Kodunu Girin"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
            />
            <div tw="flex justify-end">
              <ModalCloseButton onClick={() => setShowAddCouponModal(false)}>
                İptal
              </ModalCloseButton>
              <ModalButton onClick={handleAddCoupon}>Ekle</ModalButton>
            </div>
          </ModalContent>
        </AddCouponModal>
      )}

      <Table>
        <thead>
          <tr>
            <TableHeaderCell>Kupon Kodu</TableHeaderCell>
            <TableHeaderCell>Detay</TableHeaderCell>
            <TableHeaderCell>Son Kullanım Tarihi</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <tr key={index}>
                <TableCell>{coupon.coupon_code}</TableCell>
                <TableCell>{coupon.discount_rate}%</TableCell>
                <TableCell>
                  {new Date(coupon.end_date).toLocaleDateString()}
                </TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell colSpan="3">Kupon bulunamadı</TableCell>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default UserAccountPage;
