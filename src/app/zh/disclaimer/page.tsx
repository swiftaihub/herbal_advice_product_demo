import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/disclaimer/page";
import { wrapLocaleMetadata, wrapLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapLocaleMetadata("zh", generateSourceMetadata);
export default wrapLocalePage("zh", Impl);
