import Impl, { generateMetadata as generateSourceMetadata, generateStaticParams as generateSourceStaticParams } from "@/app-internal/localized/articles/[slug]/page";
import { wrapLocaleMetadata, wrapLocalePage, wrapLocaleStaticParams } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateMetadata = wrapLocaleMetadata("zh", generateSourceMetadata);
export const generateStaticParams = wrapLocaleStaticParams("zh", generateSourceStaticParams);
export default wrapLocalePage("zh", Impl);
