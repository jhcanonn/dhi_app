import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const HtmlToPDF = (form: HTMLFormElement | null) => {
  if (form) {
    const pdf = new jsPDF('p', 'pt', 'letter')
    html2canvas(form, {
      windowWidth: 1200,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 610
      const pageHeight = 842
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      window.open(pdf.output('bloburl'), '_blank')
    })
  }
}
