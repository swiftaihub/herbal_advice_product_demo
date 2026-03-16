import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/articles/[slug]/page";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("en", {"slug":"brewing-notes-for-a-lighter-routine"}, generateSourceMetadata);
export default wrapFixedLocalePage("en", {"slug":"brewing-notes-for-a-lighter-routine"}, Impl);
