'use client'

import moment from 'moment'
import { useMutation } from '@apollo/client'
import { PatientDataExtra } from '@components/molecules'
import { useClientContext, useGlobalContext } from '@contexts'
import { useGoTo, withToast } from '@hooks'
import { DhiPatient } from '@models'
import { getCountries } from '@utils/api'
import { Button } from 'primereact/button'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  PhoneNumberValid,
} from '@components/atoms'
import {
  LocalStorageTags,
  PAGE_PATH,
  UPDATE_PATIENT,
  civilStatus,
  convertValuesToDateIfSo,
  directusClientMapper,
  idTypes,
  parseUrl,
  pickObjectProps,
  regexPatterns,
} from '@utils'

type Props = {
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const ClientEdit = ({ showError }: Props) => {
  const [loading, setLoading] = useState(false)
  const { clientInfo, setClientInfo } = useClientContext()
  const { countries, setCountries } = useGlobalContext()
  const { goToPage } = useGoTo()
  const [updatePatient] = useMutation(UPDATE_PATIENT)

  const dataClient: DhiPatient = {
    id: clientInfo?.id,
    tipo_documento: idTypes.find((t) => t.type === clientInfo?.tipo_documento),
    documento: clientInfo?.documento,
    primer_nombre: clientInfo?.primer_nombre || '',
    segundo_nombre: clientInfo?.segundo_nombre || '',
    apellido_paterno: clientInfo?.apellido_paterno || '',
    apellido_materno: clientInfo?.apellido_materno || '',
    fecha_nacimiento: clientInfo?.fecha_nacimiento
      ? moment(clientInfo?.fecha_nacimiento as string).toDate()
      : null,
    correo: clientInfo?.correo || '',
    indicativo: undefined,
    telefono: clientInfo?.telefono || null,
    indicativo_2: undefined,
    telefono_2: clientInfo?.telefono_2 || null,
    estado_civil: civilStatus.find((c) => c.type === clientInfo?.estado_civil),
    datos_extra: clientInfo?.datos_extra
      ? convertValuesToDateIfSo(clientInfo.datos_extra)
      : undefined,
  }

  const handleForm = useForm<DhiPatient>({ defaultValues: dataClient })
  const { handleSubmit, setValue, getValues } = handleForm

  const onSubmit = async (data: DhiPatient) => {
    setLoading(true)
    setValue('datos_extra', pickObjectProps(data, 'patient_extra_'))
    const client = directusClientMapper(getValues())
    try {
      await updatePatient({
        variables: {
          id: clientInfo?.id,
          data: client,
        },
      })
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message
      showError(error?.response?.data?.status, message)
    }
    setClientInfo({ ...clientInfo, ...client })
    setLoading(false)
    clientInfo &&
      goToPage(parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }))
  }

  const fetchCountries = () => {
    const lsC = window.localStorage.getItem(LocalStorageTags.COUNTRIES)
    if (!lsC) {
      getCountries().then((c) => {
        window.localStorage.setItem(
          LocalStorageTags.COUNTRIES,
          JSON.stringify(c),
        )
        setCountries(c)
      })
    } else setCountries(JSON.parse(lsC))
  }

  const options = { shouldValidate: true }

  useEffect(() => {
    for (const key in dataClient) setValue(key, dataClient[key], options)
    const datosExtra: any = dataClient.datos_extra
    for (const key in datosExtra) setValue(key, datosExtra[key], options)
  }, [clientInfo])

  useEffect(() => {
    if (clientInfo && countries.length) {
      setValue(
        'indicativo',
        countries.find((c) => c.dialling === clientInfo.indicativo),
        options,
      )
      setValue(
        'indicativo_2',
        countries.find((c) => c.dialling === clientInfo.indicativo_2),
        options,
      )
    }
  }, [clientInfo, countries])

  useEffect(() => {
    fetchCountries()
  }, [])

  return (
    <form
      id='form_patient_main'
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 text-sm'
    >
      <section className='flex flex-col gap-y-1 bg-white rounded-md px-3 pb-3 pt-4'>
        <div className='!grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-1'>
          <DropdownValid
            name='tipo_documento'
            label='Tipo de identificación'
            handleForm={handleForm}
            list={idTypes}
            required
          />
          <InputNumberValid
            name='documento'
            label='Identificación'
            handleForm={handleForm}
            icon='id-card'
            required
            min={0}
          />
          <InputTextValid
            name='primer_nombre'
            label='Primer nombre'
            handleForm={handleForm}
            icon='user'
            required
            pattern={regexPatterns.onlyEmpty}
          />
          <InputTextValid
            name='segundo_nombre'
            label='Segundo nombre'
            handleForm={handleForm}
            icon='user'
            pattern={regexPatterns.onlyEmpty}
          />
          <InputTextValid
            name='apellido_paterno'
            label='Primer apellido'
            handleForm={handleForm}
            icon='user'
            required
            pattern={regexPatterns.onlyEmpty}
          />
          <InputTextValid
            name='apellido_materno'
            label='Segundo apellido'
            handleForm={handleForm}
            icon='user'
            pattern={regexPatterns.onlyEmpty}
          />
          <DateTimeValid
            name='fecha_nacimiento'
            label='Fecha de nacimiento'
            handleForm={handleForm}
            showTime={false}
          />
          <InputTextValid
            name='correo'
            label='Correo electrónico'
            handleForm={handleForm}
            icon='envelope'
            pattern={regexPatterns.email}
          />
          <PhoneNumberValid
            name='telefono'
            diallingName='indicativo'
            label='Teléfono'
            handleForm={handleForm}
            icon='phone'
            minLength={6}
            required
          />
          <PhoneNumberValid
            name='telefono_2'
            diallingName='indicativo_2'
            label='Teléfono 2'
            handleForm={handleForm}
            icon='phone'
            minLength={6}
          />
          <DropdownValid
            name='estado_civil'
            label='Estado civil'
            handleForm={handleForm}
            list={civilStatus}
          />
        </div>
        <PatientDataExtra id='extra' handleForm={handleForm} />
        <section className='flex flex-wrap gap-2 justify-center mt-4'>
          <Button
            type='button'
            label='Cerrar'
            icon='pi pi-times'
            severity='danger'
            onClick={() => {
              clientInfo &&
                goToPage(
                  parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }),
                )
            }}
            className='w-full md:w-fit'
          />
          <Button
            type='submit'
            label='Guardar'
            icon='pi pi-save'
            severity='success'
            className='w-full md:w-fit'
            loading={loading}
          />
        </section>
      </section>
    </form>
  )
}

export default withToast(ClientEdit)
