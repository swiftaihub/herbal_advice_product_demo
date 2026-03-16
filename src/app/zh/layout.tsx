import Impl, { generateMetadata as generateSourceMetadata } from "@/app-internal/localized/layout";
import { wrapLocaleLayout, wrapLocaleMetadata } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapLocaleMetadata("zh", generateSourceMetadata);
export default wrapLocaleLayout("zh", Impl);
