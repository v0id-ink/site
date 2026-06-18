import Landing from "@/components/Landing";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import BlockScaleWrapper from "@/components/BlockScaleWrapper";

export default function Home() {
  return (
    <main className="w-full bg-ink">
      <BlockScaleWrapper designHeight={1024} origin="center" mode="cover" backgroundColor="#101010">
        <Landing />
      </BlockScaleWrapper>

      {/* Gallery 单独做响应式，确保横向滚动、无黑边、内容完整 */}
      <Gallery />

      {/* Footer 单独做响应式，确保 Lonely 大字和联系信息都可见 */}
      <Footer />
    </main>
  );
}
