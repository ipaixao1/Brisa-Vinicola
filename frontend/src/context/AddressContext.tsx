import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

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

interface AddressContextType {
  addresses: Address[];
  addAddress: (a: Omit<Address, "id" | "isPrimary"> & { isPrimary?: boolean }) => Address;
  updateAddress: (id: string, a: Partial<Omit<Address, "id">>) => void;
  deleteAddress: (id: string) => void;
  setPrimary: (id: string) => void;
  getPrimary: () => Address | null;
}

const AddressContext = createContext<AddressContextType | null>(null);

function storageKey(email: string) { return `brisa_addresses_${email}`; }

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (!user) { setAddresses([]); return; }
    try {
      const raw = localStorage.getItem(storageKey(user.email));
      setAddresses(raw ? JSON.parse(raw) : []);
    } catch { setAddresses([]); }
  }, [user?.email]);

  function save(list: Address[]) {
    setAddresses(list);
    if (user) localStorage.setItem(storageKey(user.email), JSON.stringify(list));
  }

  function addAddress(a: Omit<Address, "id" | "isPrimary"> & { isPrimary?: boolean }): Address {
    const isFirst = addresses.length === 0;
    const newAddr: Address = { ...a, id: crypto.randomUUID(), isPrimary: a.isPrimary || isFirst };
    let list = [...addresses];
    if (newAddr.isPrimary) list = list.map(x => ({ ...x, isPrimary: false }));
    save([...list, newAddr]);
    return newAddr;
  }

  function updateAddress(id: string, updates: Partial<Omit<Address, "id">>) {
    let list = addresses.map(a => a.id === id ? { ...a, ...updates } : a);
    if (updates.isPrimary) list = list.map(a => a.id === id ? a : { ...a, isPrimary: false });
    save(list);
  }

  function deleteAddress(id: string) {
    let list = addresses.filter(a => a.id !== id);
    if (list.length > 0 && !list.some(a => a.isPrimary)) {
      list[0] = { ...list[0], isPrimary: true };
    }
    save(list);
  }

  function setPrimary(id: string) {
    save(addresses.map(a => ({ ...a, isPrimary: a.id === id })));
  }

  function getPrimary(): Address | null {
    return addresses.find(a => a.isPrimary) ?? addresses[0] ?? null;
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
