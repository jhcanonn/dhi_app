'use client'

import { AgrupadoresDirectus } from '@models'
import { PanelGroupCustomCodes } from '@utils'
import {
  FoliculosBarbaTable,
  FoliculosCapilarTable,
  FoliculosCejaTable,
  FoliculosZonaDonanteTable,
} from './customGroups'
import { Message } from 'primereact/message'

type Props = {
  group: AgrupadoresDirectus
}

const getGroupCustom = (code: string) => {
  switch (code) {
    case PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE:
      return <FoliculosZonaDonanteTable />
    case PanelGroupCustomCodes.FOLICULOS_CAPILAR:
      return <FoliculosCapilarTable />
    case PanelGroupCustomCodes.FOLICULOS_BARBA:
      return <FoliculosBarbaTable />
    case PanelGroupCustomCodes.FOLICULOS_CEJA:
      return <FoliculosCejaTable />
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

const PanelGroupCustom = ({ group }: Props) => getGroupCustom(group.code)

export default PanelGroupCustom
