import { __RouterContext as RouterContext } from "react-router";
import { useContext } from "react";

export const useRouter = () => useContext(RouterContext);
