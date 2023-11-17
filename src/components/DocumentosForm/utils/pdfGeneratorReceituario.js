import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (contentId, patient,medication, clinicData) => {
  try {
    // Get the element you want to generate a PDF from
    const content = document.getElementById(contentId);

    // Fetch clinic data from the API
    const clinicId = 4; // Define the clinic ID you want to fetch
    const clinicResponse = await fetch(
      `https://clinicapi-api.azurewebsites.net//Clinica/BuscarClinica/?id=${clinicId}`
    );

    if (!clinicResponse.ok) {
      throw new Error("Failed to fetch clinic data");
    }

    const clinicData = await clinicResponse.json();
    const imageURL = 'https://simplesdental.s3.amazonaws.com/dbs/60487/mini_perfil.png?AWSAccessKeyId=AKIAT6JHVSLKELY3OHWK&Expires=1731388472&Signature=aOjMdu%2B5rVuj43IMP%2ButQkvbIRU%3D'; 
    const image = await fetch(imageURL)
      .then(res => res.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));


    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    doc.setFontSize(12);
doc.setFont('normal'); // Ou a fonte que você escolher

    const footerYPosition = 590; // Ajuste a posição vertical para que o rodapé apareça na página
    const lineYPosition = footerYPosition - 20; // Posição vertical da linha para assinatura
    const pageCenter = 435 / 2; // Centro da página (largura A4 é 595px)

    // Draw line for signature
    doc.line(95, lineYPosition, 355, lineYPosition);

    // Define static data for the prescription
    const medicationText  = "ADVIL 400 mg ";
    const posologia = "Tomar 2 comprimidos via oral de 12 em 12 horas por 5 dias";
    const medMedida = "1 Cápsula(s)"
    const patientName = patient && patient.name ? patient.name : "Lara Evellyn";
    
    const clinicAddress = "José Luis de Souza, 296";
    const clinicAddress2 = " Santa Cruz - Lagoa Formosa - MG";
    const clinicZip = "38720-172";
    const clinicPhone = "(34) 99888-9086";
    const prescriptionText = "Uso Interno\nTomar 1 cápsula de 8 em 8 horas por 3 dias.";
    const prescriberName = "Michelly Assunção";
    const date = "29/11/2023";

    // Header
    doc.addImage(image, 'PNG', 10, 10, 100, 100);
    doc.setFontSize(14);
  
    doc.text("Dental Clinic", 116, 40); // Nome da Clinica

    
    // Clinic Info
    doc.setFontSize(12);
    doc.text( clinicAddress, 116, 60); //Endereço da clinica
    doc.text( clinicAddress2, 113, 71); //Endereço da clinica2
    doc.text( clinicZip, 116, 82);
    doc.text( clinicPhone, 116, 93); //Telefone da clinica
    

    // Titulo Receituario
    doc.setFontSize(14);
   
    doc.text("Receituario ", 188, 125); //Nome do Receituario

    // Patient Info
    doc.setFontSize(14);
    if (patient && patient.name) {
      doc.text("Paciente: " + patient.name, 40, 145);
    }
    
    // Prescription
    
      doc.text("Uso Interno", 40, 200);
      
      
      doc.text(medicationText, 40, 213);
      // Adicionar verificações semelhantes para outras variáveis como medMedida e posologia
      
      doc.text(medMedida, 330, 213);
      doc.text(posologia, 40, 226);
       // Aumente o yPos para espaçar as linhas


   // Footer text
   doc.setFontSize(12);
   const prescriberText =  prescriberName; //Profissional
   const dateText =  date; //data

   // Calculate text width to center it
   const prescriberTextWidth = doc.getTextWidth(prescriberText);
   const dateTextWidth = doc.getTextWidth(dateText);

   doc.text(prescriberText, (pageCenter - prescriberTextWidth / 2), footerYPosition);
   doc.text(dateText, (pageCenter - dateTextWidth / 2), footerYPosition + 14);

    // Save the PDF
    doc.save('Receituario.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


// utils/whatsappSender.js
export const sendWhatsAppMessage = (phone) => {
  // ... implement WhatsApp sending as shown before
  const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phone}&text=Ol%C3%A1,%20Paciente`;
};
