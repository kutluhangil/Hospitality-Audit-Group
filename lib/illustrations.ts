import type { CartItemId } from "@/lib/modules-data";

export type Illustration = { src: string; alt: string };

/**
 * Illustrations are optional by design. Every consumer must render fine without
 * one. A lettering quirk survives in the filenames: the artwork was commissioned
 * against the original module lettering, where E meant training. E now means
 * Housekeeping, so module-e-egitim.png belongs to the training service, while
 * Housekeeping (E) uses module-e-kat-hizmetleri.png.
 */
const ILLUSTRATIONS: Partial<Record<CartItemId, Illustration>> = {
  A: {
    src: "/images/modules/module-a-onburo.png",
    alt: "Ön büro modülünün soyut çizimi: ince çizgilerle bir resepsiyon bankosu, üzerinde terracotta bir oda kartı, yanında karşılamayı imleyen yaylar ve bir kronometre skalası.",
  },
  B: {
    src: "/images/modules/module-b-fb.png",
    alt: "Yiyecek & içecek modülünün soyut çizimi: yukarıdan görünen bir kuver ile porsiyon ve reçete doğruluğunu imleyen bir terazi.",
  },
  C: {
    src: "/images/modules/module-c-wellness.png",
    alt: "Wellness modülünün soyut çizimi: su yüzeyini kesen halkalar ve kimyasal ölçümü imleyen bir damla konturu.",
  },
  D: {
    src: "/images/modules/module-d-360.png",
    alt: "360° tam denetim modülünün soyut çizimi: kapalı bir devre oluşturacak şekilde birbirine bağlı dört departman karesi ve merkezlerinde tek bir nokta.",
  },
  E: {
    src: "/images/modules/module-e-kat-hizmetleri.png",
    alt: "Kat hizmetleri modülünün soyut çizimi: ince çizgiyle bir yatak, köşesinde terracotta bir zarf katı, başucunda iki yastık ve yanında balkon kapısını imleyen çerçeveli bir dikdörtgen.",
  },
  EGITIM: {
    src: "/images/modules/module-e-egitim.png",
    alt: "Personel eğitimi hizmetinin soyut çizimi: açık bir kitap ve üzerinde basamak basamak yükselen bir ok.",
  },
};

export function illustrationFor(id: CartItemId): Illustration | undefined {
  return ILLUSTRATIONS[id];
}
