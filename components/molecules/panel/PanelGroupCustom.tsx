'use client'

import { PanelGroupCustomCodes } from '@utils'
import {
  ExtractionDays,
  FoliculosBarbaTable,
  FoliculosCapilarTable,
  FoliculosCejaTable,
  FoliculosZonaDonanteTable,
} from './customGroups'
import { Message } from 'primereact/message'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  code: string
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const getGroupCustom = ({ code, handleForm, disabledData }: Props) => {
  switch (code) {
    case PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE:
      return (
        <FoliculosZonaDonanteTable
          handleForm={handleForm}
          disabledData={disabledData}
        />
      )
    case PanelGroupCustomCodes.FOLICULOS_CAPILAR:
      return (
        <FoliculosCapilarTable
          handleForm={handleForm}
          disabledData={disabledData}
        />
      )
    case PanelGroupCustomCodes.FOLICULOS_BARBA:
      return (
        <FoliculosBarbaTable
          handleForm={handleForm}
          disabledData={disabledData}
        />
      )
    case PanelGroupCustomCodes.FOLICULOS_CEJA:
      return (
        <FoliculosCejaTable
          handleForm={handleForm}
          disabledData={disabledData}
        />
      )
    case PanelGroupCustomCodes.EXTRACCION_DIAS:
      return (
        <ExtractionDays handleForm={handleForm} disabledData={disabledData} />
      )
    default:
      return (
        <Message
          severity='warn'
          text={
            <p>
              No existe una personalización definida para el código
              <strong> {code}</strong>
            </p>
          }
          className='border-primary w-full justify-content-start mb-3'
        />
      )
  }
}

const PanelGroupCustom = (props: Props) => getGroupCustom(props)

export default PanelGroupCustom
