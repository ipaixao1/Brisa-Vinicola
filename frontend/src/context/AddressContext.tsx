import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export interface Address {
  id: string;
  recipient: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
  isPrimary: boolean;
}

type NewAddress = Omit<Address, "id" | "isPrimary"> & { isPrimary?: boolean };

// A API usa id numérico; no front o id é texto
type ApiAddress = Omit<Address, "id"> & { id: number };

interface AddressContextType {
  addresses: Address[];
  addAddress: (a: NewAddress) => Promise<Address>;
  updateAddress: (id: string, a: Partial<Omit<Address, "id">>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setPrimary: (id: string) => Promise<void>;
  getPrimary: () => Address | null;
}

const AddressContext = createContext<AddressContextType | null>(null);

function toAddress(a: ApiAddress): Address {
  return { ...a, id: String(a.id) };
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);

  async function reload() {
    const list = await api<ApiAddress[]>("/addresses");
    setAddresses(list.map(toAddress));
  }

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }
    let cancelled = false;
    api<ApiAddress[]>("/addresses")
      .then((list) => {
        if (!cancelled) setAddresses(list.map(toAddress));
      })
      .catch(() => {
        if (!cancelled) setAddresses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  async function addAddress(a: NewAddress): Promise<Address> {
    const created = await api<ApiAddress>("/addresses", { method: "POST", body: a });
    await reload();
    return toAddress(created);
  }

  async function updateAddress(id: string, updates: Partial<Omit<Address, "id">>) {
    await api(`/addresses/${id}`, { method: "PUT", body: updates });
    await reload();
  }

  async function deleteAddress(id: string) {
    await api(`/addresses/${id}`, { method: "DELETE" });
    await reload();
  }

  async function setPrimary(id: string) {
    await api(`/addresses/${id}/primary`, { method: "POST" });
    await reload();
  }

  function getPrimary(): Address | null {
    return addresses.find((a) => a.isPrimary) ?? addresses[0] ?? null;
  }

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress, setPrimary, getPrimary }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used inside AddressProvider");
  return ctx;
}
