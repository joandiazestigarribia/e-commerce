import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector);
