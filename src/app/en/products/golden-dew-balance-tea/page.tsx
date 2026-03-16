import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/products/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("en", {"slug":"golden-dew-balance-tea"}, generateSourceMetadata);
export default wrapFixedLocalePage("en", {"slug":"golden-dew-balance-tea"}, Impl);
