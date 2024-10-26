import React, {FC} from "react";
import { PrimaryTextInput } from "@inputs/text-input/primary"
import { PrimaryTooltip } from '@ui-kit/tooltip/primary'
import {iconList} from "./const"
import { ReactComponent as HintIcon} from '@icons/hint.svg'

import {PrimaryTextInputWithHintProps} from './types'


export const PrimaryTextInputWithHint: FC<PrimaryTextInputWithHintProps> = ({ hint, icon, ...props}) => {
    return (<PrimaryTextInput {...props}
                                    LeftIcon={icon && iconList[icon]}
                                    RightIcon={hint && (() => (
                                        <PrimaryTooltip title={hint} placement='top-right' >
                                            <HintIcon/>
                                        </PrimaryTooltip>
                                        ))}
    />)
}