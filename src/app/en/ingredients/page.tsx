import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/ingredients/page";
import { wrapLocaleMetadata, wrapLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapLocaleMetadata("en", generateSourceMetadata);
export default wrapLocalePage("en", Impl);
