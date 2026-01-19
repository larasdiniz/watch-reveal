import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/types/order";

interface AddressFormProps {
  value: Address;
  onChange: (address: Address) => void;
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    onChange({ ...value, cep: cleanCep });

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        // TODO: Replace with actual CEP API call (ViaCEP, etc.)
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mock response - in production, fetch from ViaCEP
        onChange({
          ...value,
          cep: cleanCep,
          street: "Avenida Paulista",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
        });
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const formatCep = (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length > 5) {
      return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
    }
    return clean;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-medium">Endereço de Entrega</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <div className="relative">
            <Input
              id="cep"
              placeholder="00000-000"
              value={formatCep(value.cep)}
              onChange={(e) => handleCepChange(e.target.value)}
              maxLength={9}
              className="bg-background border-border"
            />
            {isLoadingCep && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="SP"
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            maxLength={2}
            className="bg-background border-border uppercase"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Rua</Label>
        <Input
          id="street"
          placeholder="Nome da rua"
          value={value.street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          className="bg-background border-border"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="123"
            value={value.number}
            onChange={(e) => onChange({ ...value, number: e.target.value })}
            className="bg-background border-border"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, sala, etc. (opcional)"
            value={value.complement || ""}
            onChange={(e) => onChange({ ...value, complement: e.target.value })}
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            value={value.neighborhood}
            onChange={(e) => onChange({ ...value, neighborhood: e.target.value })}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Cidade"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="bg-background border-border"
          />
        </div>
      </div>
    </div>
  );
}
