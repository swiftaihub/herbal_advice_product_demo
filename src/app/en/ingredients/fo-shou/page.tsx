import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/ingredients/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("en", {"slug":"fo-shou"}, generateSourceMetadata);
export default wrapFixedLocalePage("en", {"slug":"fo-shou"}, Impl);
