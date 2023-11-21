'use client'

import ExtraData, { Th, Tr } from './ExtraData'
import { Card } from 'primereact/card'
import { getAge, getFormatedDateToEs } from '@utils'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ClientDirectus, PatientExtraData } from '@models'
import { useEffect, useState } from 'react'
import { PrimeIcons } from 'primereact/api'

type Props = {
  clientInfo: ClientDirectus | null
}

const ExtraDataDetail = ({ clientInfo }: Props) => {
  const [visibleExtraData, setVisibleExtraData] = useState<boolean>(false)
  const [extraData, setExtraData] = useState<PatientExtraData | null>(null)

  const footerExtraDataDialog = (
    <div className='flex flex-col md:flex-row gap-2 justify-center'>
      <Button
        type='button'
        label='Cerrar'
        icon={PrimeIcons.TIMES}
        severity='danger'
        className='w-full md:w-fit m-0'
        onClick={() => setVisibleExtraData(false)}
      />
    </div>
  )

  useEffect(() => {
    if (clientInfo?.datos_extra) {
      const extraData: PatientExtraData = clientInfo.datos_extra as any
      setExtraData(extraData)
    }
  }, [clientInfo])

  return (
    <>
      <Dialog
        draggable={false}
        visible={visibleExtraData}
        header={
          <p className='text-brand font-bold'>
            Datos extra de {clientInfo?.full_name}
          </p>
        }
        footer={footerExtraDataDialog}
        onHide={() => setVisibleExtraData(false)}
        className='w-[90vw] max-w-[100rem]'
      >
        <ExtraData clientInfo={clientInfo} hideHeader large />
      </Dialog>
      <Card className='custom-table-card mb-4'>
        <section className='!grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-1 h-fit'>
          <Th>Identificación:</Th>
          <Tr>{clientInfo?.documento}</Tr>
          <Th>Edad:</Th>
          <Tr>{getAge(clientInfo?.fecha_nacimiento)}</Tr>
          <Th>Fecha de nacimiento:</Th>
          <Tr>
            {clientInfo?.fecha_nacimiento
              ? getFormatedDateToEs(clientInfo.fecha_nacimiento, 'ddd LL')
              : ''}
          </Tr>
          <Th>Dirección:</Th>
          <Tr>{extraData?.patient_extra_direccion}</Tr>
          <Th>Municipio:</Th>
          <Tr>{extraData?.patient_extra_municipio}</Tr>
          <Th>Datos extra:</Th>
          <Tr>
            <Button
              type='button'
              label='Ver datos'
              severity='help'
              className='w-full md:w-fit min-w-[7rem] h-fit text-sm py-0'
              onClick={() => setVisibleExtraData(true)}
              link
            />
          </Tr>
        </section>
      </Card>
    </>
  )
}

export default ExtraDataDetail
