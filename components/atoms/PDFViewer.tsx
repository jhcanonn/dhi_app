type Props = {
  file: string
  width?: string
  height?: string
}

const PDFViewer = ({ file, width, height }: Props) => {
  return (
    <embed src={file} width={width ?? '100%'} height={height ?? '800'}></embed>
  )
}

export default PDFViewer

// EXAMPLE
// <PDFViewer file='https://cms.dhicolombia.net/assets/a922d4d5-208e-409a-ad9f-330fcd3f9a6d' />
