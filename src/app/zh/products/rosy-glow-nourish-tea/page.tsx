import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/products/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("zh", {"slug":"rosy-glow-nourish-tea"}, generateSourceMetadata);
export default wrapFixedLocalePage("zh", {"slug":"rosy-glow-nourish-tea"}, Impl);
