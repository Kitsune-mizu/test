import Image from "next/image";

export function AboutDan() {
  return (
    <section className="bg-white border-t border-neutral-100">
      {/* About Hikaru */}
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Label */}
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-400 font-medium">
            道 — The Maker
          </span>

          {/* Heading in Japanese */}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-black tracking-tight">
            ヒカルについて
          </h2>
          <p className="text-sm text-neutral-500 -mt-2">About Hikaru</p>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-neutral-200" />
            <div className="h-1 w-1 rounded-full bg-[#E10600]" />
            <div className="h-px w-16 bg-neutral-200" />
          </div>

          {/* Body in Japanese */}
          <p className="text-neutral-600 leading-relaxed max-w-2xl text-base">
            光る冒険（ヒカル・ボウケン）は、山、トレイル、そして東南アジアをはじめとする世界中の自然を探検してきた情熱的なアウトドア愛好家によって設立されました。
            品質の高い職人技と探検の精神への愛情に駆り立てられ —{" "}
            <span className="text-black font-medium">光る冒険</span> —
            このプラットフォームは、真に優れたパフォーマンスを発揮するギアと冒険家をつなぐために作られました。
          </p>
          <p className="text-neutral-600 leading-relaxed max-w-2xl text-base">
            光る冒険カタログのすべての製品は、耐久性、快適さ、パフォーマンスについて個別に評価されています。
            テクニカルなハイキングシューズから遠征グレードのバックパックまで、各アイテムは旅への献身を反映しています
            —<span className="italic text-neutral-500">旅 (tabi)</span>。
          </p>

          {/* Quote */}
          <blockquote className="mt-4 border-l-2 border-[#E10600] pl-6 text-left max-w-xl">
            <p className="text-neutral-700 italic text-lg leading-relaxed">
              「山はあなたがどれだけ準備しているかを気にしません —
              しかし私は気にします。」
            </p>
            <p className="text-neutral-500 italic text-sm mt-1">
              "The mountain does not care how prepared you are — but I do."
            </p>
            <footer className="mt-2 text-sm text-neutral-400 font-medium tracking-wide uppercase">
              — HiB Founder
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Brand Logo Image */}
      <div className="flex flex-col items-center pb-24 px-4 gap-4">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <Image
            src="/images/hikaru-logo-calligraphy.png"
            alt="Hikaru Bouken calligraphy logo — 光る冒険"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 256px, 320px"
          />
        </div>
        {/* Text below the image */}
        <div className="flex flex-col items-center gap-1 mt-2">
          <span className="text-2xl font-heading font-bold text-black tracking-tight">
            光る冒険
          </span>
          <span className="text-sm text-neutral-500 tracking-wide">
            Hikaru Adventure
          </span>
        </div>
      </div>
    </section>
  );
}
