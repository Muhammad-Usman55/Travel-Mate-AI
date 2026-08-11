'use client';

import { ArrowRight, CircleDollarSign } from 'lucide-react';

interface CurrencyData {
  from: string;
  from_name: string;
  to: string;
  to_name: string;
  amount: number;
  converted: number;
  rate: number;
  date: string;
}

interface CurrencyCardProps {
  currency: CurrencyData;
}

export function CurrencyCard({ currency }: CurrencyCardProps) {
  return (
    <div className="border rounded-xl p-4 bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="brand-subtle brand-text flex size-7 items-center justify-center rounded-lg">
          <CircleDollarSign className="size-4" />
        </span>
        <h3 className="font-semibold">Currency Conversion</h3>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">
            {currency.amount.toLocaleString()} {currency.from}
          </p>
          <p className="text-xs text-muted-foreground">{currency.from_name}</p>
        </div>

        <div className="brand-text">
          <ArrowRight className="size-5" />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold brand-text tabular-nums">
            {currency.converted.toLocaleString()} {currency.to}
          </p>
          <p className="text-xs text-muted-foreground">{currency.to_name}</p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground border-t pt-2 text-center tabular-nums">
        Rate: 1 {currency.from} = {currency.rate} {currency.to}
        {currency.date && (
          <span className="ml-2">· {new Date(currency.date).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}
