import { useNavigate as useReactNavigate, useLocation as useReactLocation } from "react-router-dom";

/**
 * useRouter hook for convenience
 * Provides a similar API to Next.js router while using React Router under the hood.
 */
export const useRouter = () => {
  const navigate = useReactNavigate();
  const location = useReactLocation();
  
  return {
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    pathname: location.pathname,
  };
};

/**
 * usePathname hook for convenience
 */
export const usePathname = () => {
  const location = useReactLocation();
  return location.pathname;
};
