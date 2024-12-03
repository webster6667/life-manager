import { makeAutoObservable } from 'mobx'
import { createPortInnerDefault } from '@easy-diagram/components/port/PortInnerDefault'
import { PortState } from '@easy-diagram/states/portState'
import {
  VisualComponents,
  COMPONENT_DEFAULT_TYPE,
  IVisualComponentsObject
} from '@easy-diagram/states/visualComponents'
import { IVisualComponentProps } from '@easy-diagram/states/visualComponentState'

export class PortsSettings {
  private _portVisualComponents: VisualComponents<any, IPortVisualComponentProps> =
    new VisualComponents<any, IPortVisualComponentProps>({
      [COMPONENT_DEFAULT_TYPE]: createPortInnerDefault()
    })

  constructor() {
    makeAutoObservable(this)
  }

  get portVisualComponents() {
    return this._portVisualComponents
  }

  import = (obj?: IPortsSettings) => {
    this.portVisualComponents.import(obj)
  }
}

export interface IPortVisualComponentProps<TSettings = any>
  extends IVisualComponentProps<PortState, TSettings> {}

export interface IPortsSettings extends IVisualComponentsObject<any, IPortVisualComponentProps> {}
