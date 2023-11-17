import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (contentId, patient,tipo,formData) => {
  try {
    console.log(tipo);
    // Get the element you want to generate a PDF from
    const content = document.getElementById(contentId);

 
    const imageURL = 'https://simplesdental.s3.amazonaws.com/dbs/60487/mini_perfil.png?AWSAccessKeyId=AKIAT6JHVSLKELY3OHWK&Expires=1731388472&Signature=aOjMdu%2B5rVuj43IMP%2ButQkvbIRU%3D'; 
    const image = await fetch(imageURL)
      .then(res => res.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));

   
      let tituloAtestado, clinicAddress, clinicAddress2, clinicZip, clinicPhone, AtestadoText, AtestadoText2,AtestadoText3, prescriberName, date,horaInicial,horaFinal,cid,dia,tituloComparecimento;

    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    doc.setFontSize(12);
doc.setFont('normal'); // Ou a fonte que você escolher

    const footerYPosition = 530; // Ajuste a posição vertical para que o rodapé apareça na página
    const lineYPosition = footerYPosition - 20; // Posição vertical da linha para assinatura
    const pageCenter = 435 / 2; // Centro da página (largura A4 é 595px)

    // Draw line for signature
    doc.line(95, lineYPosition, 355, lineYPosition);

    // Define static data for the prescription
    if (tipo === true) { //Dias
      tituloAtestado = "";
     tituloComparecimento = "DECLARAÇÃO DE COMPARECIMENTO";
     clinicAddress = "José Luis de Souza, 296";
     clinicAddress2 = " Santa Cruz - Lagoa Formosa - MG";
     clinicZip = "38720-172";
     clinicPhone = "(34) 99888-9086";
     AtestadoText = "Atesto, com o fim específico de dispensa de atividades trabalhistas (ou escolares ou judiciárias),";
     prescriberName = "Michelly Assunção";
     date = `${formData.date}`;
     horaInicial = `${formData.horaInicial}`;
     horaFinal = `${formData.horaFinal}`;
     cid = `${formData.cid}`;
     AtestadoText2 =  "que " + patient.name + " esteve sob meus cuidados profissionais no dia "  + " " + date + " das " +horaInicial + " às " + horaFinal;
     AtestadoText3 = "horas"

  } else if (tipo === false) { 
     tituloAtestado = "DECLARAÇÃO DE ATESTADO";
     tituloComparecimento = "";
     clinicAddress = "José Luis de Souza, 296";
     clinicAddress2 = " Santa Cruz - Lagoa Formosa - MG";
     clinicZip = "38720-172";
     clinicPhone = "(34) 99888-9086";
     prescriberName = "Michelly Assunção";
     date = `${formData.date}`;
     cid = `${formData.cid}`;
     dia = `${formData.dias}`;
     AtestadoText = "Atesto, com o fim específico de dispensa de atividades trabalhistas (ou escolares ou judiciárias),";
     AtestadoText2 = "que " + patient.name + " esteve sob meus cuidados profissionais no dia "  + date + " devendo permanecer";
     AtestadoText3 = "em repouso por " + dia + " dias ";
  }
    // Header
    doc.addImage(image, 'PNG', 10, 10, 100, 100);
    doc.setFontSize(14);
  
    doc.text("Dental Clinic", 116, 40); // Nome da Clinica
    doc.text(date, 386, 40); // Data do Documento
    
    // Clinic Info
    doc.setFontSize(12);
    doc.text( clinicAddress, 116, 60); //Endereço da clinica
    doc.text( clinicAddress2, 113, 71); //Endereço da clinica2
    doc.text( clinicZip, 116, 82);
    doc.text( clinicPhone, 116, 93); //Telefone da clinica
    

    // Titulo ATESTADO
    doc.setFontSize(20);
    doc.text(tituloComparecimento, 95, 145);//titulo do Comparecimento
    doc.text(tituloAtestado, 125, 145); //titulo do ATESTADO

    // Patient Info
    doc.setFontSize(14);
    doc.text(AtestadoText , 30, 200);
    doc.text(AtestadoText2 , 20, 212);
    doc.text(AtestadoText3, 20, 224)

    const prescriberText =  prescriberName; //Profissional
    const dateText =  date; //data

    // Calculate text width to center it
   const prescriberTextWidth = doc.getTextWidth(prescriberText);
   const dateTextWidth = doc.getTextWidth(dateText);

    doc.setFontSize(15);
    doc.text("Atenciosamente,", 184,340);
    doc.text(prescriberText, (pageCenter - prescriberTextWidth / 2),353);

   // Footer text
   doc.setFontSize(14);
   doc.text("Eu, ",76,511)
   doc.text("autorizo que meu diagnóstico(CID) esteja presente nesse atestado.", 78, 526);
   doc.text("CID: " + cid,90,570)

    // Save the PDF
    doc.save('Atestado.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


// utils/whatsappSender.js
export const sendWhatsAppMessage = (phone) => {
  // ... implement WhatsApp sending as shown before
  const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phone}&text=Ol%C3%A1,%20Paciente`;
};
