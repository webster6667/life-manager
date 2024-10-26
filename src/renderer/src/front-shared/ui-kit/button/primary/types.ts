import {ButtonHTMLAttributes, FC, ReactElement, ComponentProps } from "react";
import {PrimarySpinner, SpinnerProps} from "@ui-kit/loading/spinner/primary";


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * How large should the button be?
     */
    sizeMod?: "sm" | "md";
    /**
     * Button contents
     */
    label: string;
    /**
     * Button modifications
     */
    mod?: 'primary' | 'secondary'

    help:  <T extends FC<SpinnerProps>>(Component: T) => ReturnType
    // help:  (Component: FC<SpinnerProps>) => ReactElement<SpinnerProps>
}