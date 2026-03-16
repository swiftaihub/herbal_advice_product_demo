import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/ingredients/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("en", {"slug":"chrysanthemum"}, generateSourceMetadata);
export default wrapFixedLocalePage("en", {"slug":"chrysanthemum"}, Impl);
