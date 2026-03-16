import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/articles/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("zh", {"slug":"tea-as-a-giftable-ritual"}, generateSourceMetadata);
export default wrapFixedLocalePage("zh", {"slug":"tea-as-a-giftable-ritual"}, Impl);
