export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/home", "/dashboard/:path*", "/protected/:path*"],
};
