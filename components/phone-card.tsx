import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { phoneKindLabels, phoneStatusLabels, phoneStatusTone } from "@/lib/constants";
import type { Phone } from "@/types/domain";

export function PhoneCard({ phone }: { phone: Phone }) {
  const cover = phone.phone_images?.[0]?.public_url;

  return (
    <Link href={`/kho/${phone.id}`} className="block">
      <Card className="overflow-hidden transition hover:border-mint/50">
        <CardContent className="grid grid-cols-[6rem_1fr] gap-3 p-3 sm:grid-cols-[7rem_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-panel">
            {cover ? (
              <Image src={cover} alt={phone.name} fill sizes="120px" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-slate-500">
                <Camera className="h-7 w-7" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-50">{phone.name}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{phone.model} · {phone.storage}</p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-500" />
            </div>
            <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-100">{phone.appearance}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={phoneStatusTone[phone.status]}>{phoneStatusLabels[phone.status]}</Badge>
              <Badge>{phoneKindLabels[phone.kind]}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
