import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AddressProvider } from "./context/AddressContext";
import { CardProvider } from "./context/CardContext";
import App from "./App";
import VinhosPage from "./pages/VinhosPage";
import WineDetailPage from "./pages/WineDetailPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import QuizResultPage from "./pages/QuizResultPage";
import ConteudoPersonalizadoPage from "./pages/ConteudoPersonalizadoPage";
import FaleConoscoPage from "./pages/FaleConoscoPage";
import CarrinhoPage from "./pages/CarrinhoPage";
import CheckoutPage from "./pages/CheckoutPage";
import PedidoConfirmadoPage from "./pages/PedidoConfirmadoPage";
import PaymentPage from "./pages/PaymentPage";
import MeusPedidosPage from "./pages/MeusPedidosPage";
import AcompanharPedidoPage from "./pages/AcompanharPedidoPage";
import MinhaContaPage from "./pages/MinhaContaPage";
import MeusEnderecosPage from "./pages/MeusEnderecosPage";
import MeusCartoesPage from "./pages/MeusCartoesPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AddressProvider>
            <CardProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/vinhos" element={<VinhosPage />} />
                <Route path="/vinhos/:id" element={<WineDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<CadastroPage />} />
                <Route path="/quiz-resultado" element={<QuizResultPage />} />
                <Route path="/conteudo-personalizado" element={<ConteudoPersonalizadoPage />} />
                <Route path="/fale-conosco" element={<FaleConoscoPage />} />
                <Route path="/carrinho" element={<CarrinhoPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pagamento" element={<PaymentPage />} />
                <Route path="/pedido-confirmado" element={<PedidoConfirmadoPage />} />
                <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
                <Route path="/meus-pedidos/:id" element={<AcompanharPedidoPage />} />
                <Route path="/minha-conta" element={<MinhaContaPage />} />
                <Route path="/meus-enderecos" element={<MeusEnderecosPage />} />
                <Route path="/meus-cartoes" element={<MeusCartoesPage />} />
              </Routes>
            </CardProvider>
            </AddressProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
