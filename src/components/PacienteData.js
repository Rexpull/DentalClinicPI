import React, { useEffect, useState,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { Paper, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import ReceituarioForm from "./DocumentosForm/ReceituarioForm";
import AtestadoForm from "./DocumentosForm/AtestadoForm";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; 
import PrintIcon from '@mui/icons-material/Print';
import AddEvolutionModal from "./AddEvolutionModal";
import Switch from "@mui/material/Switch";
import "../style/css/tratamento.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import DialogActions from '@mui/material/DialogActions';
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material";

function PatientPage( user,onViewClick ) {
  const [appointments, setAppointments] = useState([]);
  const [evolutions, setEvolutions] = useState([]); // State to hold evolution records
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showAtestadoForm, setShowAtestadoForm] = useState(false);
  const [isAddEvolutionModalOpen, setIsAddEvolutionModalOpen] = useState(false);
  const [treatment, setTreatment] = useState("");
  const [toothRegion, setToothRegion] = useState("");
  const [value, setValue] = useState("");
  const [professional, setProfessional] = useState("");
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [patient, setPatient] = useState({
    name: "Carregando...",
    phone: "",
    id: "",
  });
  const [responsible, setResponsible] = useState({
    name: "",
    phone: "",
    birthDate: "",
    cpf: "",
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  const [documentHistory, setDocumentHistory] = useState([]);
  const [professionalNames, setProfessionalNames] = useState({});
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractData, setContractData] = useState({
    patientName: '',
    cpf: '',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    contractedName: '',
    contractedCpf: '',
    contractCity: '',
    contractValue: '',
    treatments: ''
  });
  const estadosBrasileiros = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];
  const [isFormValid, setIsFormValid] = useState(false);
  const editorRef = useRef(null);
  const [professionals, setProfessionals] = useState([]);


  const handleProfessionalChange = (event) => {
    const selectedProfessionalId = event.target.value;
    setProfessional(selectedProfessionalId);
  
    const selectedProfessional = professionals.find(prof => prof.id === selectedProfessionalId);
    if (selectedProfessional) {
      setContractData(prevData => ({
        ...prevData,
        contractedName: selectedProfessional.nome,
      }));
    }
  };
  

  const saveContract = async () => {
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Convertendo o offset para milissegundos
    const localDate = new Date(currentDate.getTime() - timezoneOffset);
  
    const contractDataToSend = {
      pacienteId: patient.id,
      profissionalId: professional,
      descricao: editorRef.current.getContent(),
      data: localDate.toISOString().split('T')[0]
    };
  
    try {
      const response = await axios.post(
        'https://clinicapi-api.azurewebsites.net/Contrato/CriarContrato',
        contractDataToSend
      );
      if (response.status === 200) {
        // Sucesso
        console.log('Contrato salvo com sucesso!');
        toast.success('Sucesso na criação do Contrato', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        setIsContractModalOpen(false); // Fechar o modal
      } else {
        // Tratar erros de resposta
        console.error('Erro ao salvar contrato:', response);
        toast.error('Erro ao salvar contrato', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }
    } catch (error) {
      // Tratar erros de requisição
      console.error('Erro na requisição para salvar o contrato:', error);
      toast.error('Erro na requisição para salvar o contrato', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };
  
  
  useEffect(() => {
    // Função para carregar os profissionais do banco de dados
    const fetchProfessionals = async () => {
      const professionalusers = "https://clinicapi-api.azurewebsites.net/Usuario/ListarUsuarios?param=0";
      try {
        const response = await axios.get(professionalusers);
        if (response.status === 200) {
          const fetchedProfessionals = response.data.retorno.map(user => ({
            id: user.id,
            nome: user.nome,
          }));
          setProfessionals(fetchedProfessionals);
          
        } else {
          console.error("Erro ao buscar profissionais. Status:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    };

    fetchProfessionals();
  }, []);


  useEffect(() => {
    // Verifica se todos os campos do contrato estão preenchidos
    const allFieldsFilled = Object.values(contractData).every((value) => value.trim() !== '');
    setIsFormValid(allFieldsFilled);
  }, [contractData]);

  



  const [contractContent, setContractContent] = useState(`


  `);

  useEffect(() => {
    setContractContent(`
    <div style="display: flex; flex-direction: column; justify-content: center;">
      <div style="text-align: center;">
        <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS ODONTOLÓGICOS</h2>
      </div>
    </div>
    <br />
    <p><b>São partes do presente instrumento:</b></p>
    
        <p> <span style="background-color: ${contractData.patientName ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.patientName || 'Nome paciente'}</span>, inscrito no Cadastro de Pessoas Físicas sob n. <span style="background-color: ${contractData.cpf ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.cpf || 'CPF contratante'}</span> residente e domiciliado em <span style="background-color: ${contractData.city ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.city || 'Cidade contratante'}</span>, à rua <span style="background-color: ${contractData.street ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.street || 'Endereço contratante'}</span>, bairro <span style="background-color: ${contractData.neighborhood ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.neighborhood || 'Bairro contratante'}</span>, CEP <span style="background-color: ${contractData.cep ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.cep || 'CEP contratante'}</span>, doravante denominado CONTRATANTE e de outro lado <span style="background-color: ${contractData.contractedName ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.contractedName || 'Nome contratado'}</span>, CPF/CNPJ nº <span style="background-color: ${contractData.contractedCpf ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.contractedCpf || 'CPF/CNPJ contratado'}</span> doravante denominada CONTRATADA, resolvem de comum acordo celebrar o presente Contrato para Prestação de Serviços Odontológicos, com fulcro no Código Civil, Código de Defesa do Consumidor e no Código de Ética Odontológico o qual se regerá pelas seguintes cláusulas e condições:</p>

    
    <h4><b>DO OBJETO DO CONTRATO:</b></h4>
    
    <h4><b>CLÁUSULA 1ª:</b></h4> 
    
    <p>O presente instrumento tem por objeto a prestação de serviços pela CONTRATADA(O) apta(o) e habilitada(o) à realização plena e segura do(s) procedimento(s) abaixo descriminado(s) no(a) paciente <span style="background-color: ${contractData.patientName ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.patientName || 'Nome paciente'}</span></p>

    <p><span style="background-color: ${contractData.treatments ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.treatments || 'Descrição dos tratamentos'}</span></p>

    <p><b>Parágrafo Primeiro:</b> Os serviços odontológicos contratados compreendem na realização dos procedimentos contratados nas datas e horários de acordo com agendamento prévio.</p>

    <p><b>Parágrafo Segundo:</b> A CONTRATADA resta também autorizada a realizar procedimentos não referidos na Cláusula Primeira, desde que no decorrer do ato odontológico (planejamento e execução) verifique-se a sua viabilidade para o procedimento ou para qualquer outra situação que seja tecnicamente realizável ao(à) CONTRATANTE, desde que, por óbvio, haja anuência por ele(a).</p>

    <p><b>Parágrafo Terceiro:</b> A CONTRATANTE, a partir deste instrumento se declara ciente do produto e materiais utilizados em todos os seus detalhamentos, bem como tem plena consciência que, apesar de uma previsão industrial de durabilidade, tal prazo tende a sofrer latentes oscilações em razão de todos os vetores imponderáveis que passarão a influenciar no tratamento, especialmente a conduta da(o) CONTRATANTE frente aos serviços prestados e sua postura enquanto paciente.</p>

    <h4><b>CLÁUSULA 2ª:</b></h4> 
    
    <p>O paciente declara, a partir deste contrato travado de boa fé e plena autonomia, que A(O) CONTRATADO(A) foi claro, didático e transparente no que se refere ao procedimento a ser realizado, informando a sua necessidade, conceito, dores, riscos, desconfortos, efeitos colaterais possíveis, alternativas, expectativas em relação ao potencial resultado, entre outras situações que podem gerar modificações no cenário. Além disso, <b>que o(s) procedimento(s) gerará(ão) os resultados alinhados com as condições fisiológicas, anatômicas e orgânicas do paciente.</b></p>

    <p><b>Parágrafo Único.</b> Declara, ademais, que tem consciência de que não há garantia de satisfação ou felicidade com o procedimento e sim o dever do profissional da saúde de seguir o roteiro técnico mais adequado e fazer o melhor possível dentro das condições e circunstâncias presentes.</p>

    <h3><b>DOS CUSTOS:</b></h3>

    <h4><b>CLÁUSULA 3ª:</b></h4>
    
    <p>As partes ajustam que, o valor cobrado corresponde aos custos dos materiais utilizados, bem como os materiais descartáveis e a mão de obra, totalizando o valor de R$ <span style="background-color: ${contractData.contractValue ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.contractValue || 'Valor contrato'}</span>.</p>

    <h3><b>OBRIGAÇÕES DO(A) PACIENTE CONTRATANTE:</b></h3>

    <h4><b>CLÁUSULA 4ª:</b> São obrigações do(a) PACIENTE:</h4>
    <ol type="a">
    <li>Compreender sua posição de corresponsável no tratamento e seguir rigorosamente todas as orientações do profissional relacionadas ao 
    tratamento/procedimento(s) efetuado(s), em âmbito pré e pós-procedimental e informar ao profissional qualquer desconforto sentido, de qualquer 
    natureza, sob pena de incorrer em responsabilidade pelo potencial insucesso do tratamento;</li>

    <li>Manter atualizado o cadastro junto à CONTRATADA, para que se tenha a máxima eficiência na comunicação e também agilidade dos agendamentos das consultas;</li>

    <li>Honrar com o pagamento dos honorários profissionais do(a) CONTRATADO(A), de acordo com as condições pactuadas, sob pena de suspensão do tratamento, com os devidos cuidados de saúde;</li>

    <li>Informar ao(à) CONTRATADO(A) a respeito de seu histórico em relação à sensibilidade e alergias para medicamentos e anestésicos, e ainda a respeito de problemas de sangramento, alergias, infecções recentes, bem como fornecer documentos e informações acerca de seus anteriores tratamentos equivalentes ou assemelhados;</li>

    <li>Comparecer pontualmente às consultas agendadas, buscando desmarcá-las apenas em casos justificados e com antecedência;</li>

    <li>Caso a CONTRATANTE não compareça nas datas e horários pré-definidos, abandonando o tratamento, A(O) CONTRATADO(A) exime-se de qualquer responsabilidade no que diz respeito a resultados esperados dos procedimentos, restando rescindido o presente contrato de pleno direito, sem necessidade de qualquer outra formalidade, sendo devido pagamento os valores contratados A(O) CONTRATADO(A) em sua integralidade como forma de compensação por perdas e danos;</li>

    <li>Acatar todas as recomendações e prescrições efetuadas pelo(a) CONTRATADO(A), seja em relação a medicamentos, controles e cuidados antes, durante e após o tratamento, conforme instruções repassadas por escrito a cada procedimento realizado;</li>

    <li>Realizar todos os exames solicitados pelo(a) CONTRATADO(A), de modo a propiciar condições para o perfeito diagnóstico e desenrolar do tratamento, ficando o profissional livre para negar-se a efetuar os procedimentos dos quais não tenha os subsídios necessários à realização do tratamento em razão de desídia ou negligência do(a) paciente;</li>

    <li>Comparecer às consultas agendadas, em especial naquelas marcadas para continuidade de tratamento já iniciado ou que se mostre urgente, sob risco de comprometer o sucesso dos serviços contratados;</li>

    <li>Nos casos em que os serviços foram integralmente prestados ou, se parcialmente prestados, superarem os honorários já pagos, fica ciente desde já o paciente que deverá arcar com os custos remanescentes dos procedimentos que foram realizados e não adimplidos, sob pena de cobranças extrajudiciais e judiciais, se necessário;</li>

    <li>Avisar imediatamente qualquer sinal, indício ou fato que denote uma reação adversa, intercorrência ou complicação, devendo a(o) paciente ir diretamente ao encontre da(o) contratante e não de outro profissional sem o devido conhecimento do histórico odontológico.</li></ol>

    <h3><b>OBRIGAÇÕES DO(A) CONTRATADO(A): </b></h3>

    <h4><b>CLÁUSULA 5ª:</b> São obrigações do(a) CONTRATADO(A):</h4>

    <ol type="a">
    <li>Executar o tratamento indicado em ambiente de trabalho seguro ao paciente, observando os padrões de higiene e sanitários em geral aplicáveis ao caso;</li>
    <li>Realizar os procedimentos de acordo com a melhor técnica, observando o estado atual da ciência, o zelo, a prudência e a honestidade;</li>
    <li>Esclarecer previamente o CONTRATANTE, diante das especificações de cada procedimento, contratado ou eventual, a respeito das vantagens, riscos, consequências e valores (honorários);</li>
    <li>Informar o CONTRATANTE a cada procedimento realizado, a respeito do plano de tratamento e sua sequência (evolução), se o caso;</li>
    <li>Observar todos os preceitos éticos contidos no Código de Ética de sua profissão, além de todas as outras legislações pertinentes ao procedimento;</li>
    <li>Resguardar a privacidade do CONTRATANTE durante todo o tratamento, bem como após, notadamente o seu prontuário e todas as informações e dados sensíveis (Lei Geral de Proteção de Dados);</li>
    <li>Acompanhar o CONTRATANTE durante todo o tratamento, ou</li>
    <li>Dar assistência necessária ao Contratante durante o período pós-procedimental, até sua completa recuperação;</li>
    <li>Fornecer o prontuário odontológico e tudo que dele faz parte quando do pedido da(o) contratante para retirada presencial do titular no estabelecimento odontológico mediante marcação prévia de agenda para tal.</li>
    </ol>

    <p><b>Parágrafo Único:</b> A alínea "g)" ficará vinculada a uma série de variáveis, especialmente o comprometimento da(o) paciente frente ao procedimento realizado, não sendo responsáveis a profissional e a empresa CONTRATADA por eventual abandono ou interrupção precoce dos procedimentos, nem tampouco pelo mero descontentamento do paciente.</p>

    <h3><b>DA RESPONSABILIDADE</b></h3>

    <h3><b>CLÁUSULA 6ª</b></h3>
    
    <p>A responsabilidade assumida pelo(a) CONTRATADO(A) por força do presente instrumento é de meio, ou seja, incumbe ao profissional agir dentro da melhor técnica na execução dos serviços, despendendo todos os esforços e meios necessários para alcance do objetivo possível no tratamento, todavia, sem responsabilizar-se pelo resultado, uma vez que SEMPRE permeado pelo imponderável da vida humana e outras variáveis óbvias que envolvem o serviço.</p>

    <p><b>Parágrafo Primeiro:</b> O(A) CONTRATADO(A) não se responsabilizará por quaisquer consequências ao tratamento, bem como por prejuízos financeiros, estéticos e morais gerados ao(à) CONTRATANTE em virtude de sua não cooperação no antes, durante e após o tratamento, ou ainda pela omissão de informações relevantes para o diagnóstico (anamnese) e prognóstico do caso.</p>

    <p><b>Parágrafo Segundo:</b> Considera-se como não cooperação do paciente, para fins do presente instrumento, o não comparecimento às consultas agendadas, atrasos injustificados, o abandono do tratamento e a não observação das recomendações prescritas pelo profissional cirurgião dentista, dentre outras possíveis que não se exaurem com hipóteses explicitadas neste clausulado.</p>

    <p><b>Parágrafo Terceiro:</b> O(A) CONTRATADO(A), considerando os riscos inerentes ao tratamento, não se responsabilizará por eventuais efeitos imprevisíveis ou de baixíssima previsibilidade que venham ocorrer pela execução dos serviços, desde que observadas a boa técnica recomendável, bem como considerando para as diretrizes contidas no §1° do art. 14 da Lei n.° 8.078/90 (Código de Defesa do Consumidor), Código de Ética Odontológico, bem como as causas excludentes de responsabilidade e culpabilidade.</p>

    <p><b>Parágrafo Quarto:</b> A(O) CONTRATADO(A) não se responsabiliza, salvo nos casos de manejo inadequado, por qualquer defeito proveniente da máquina/equipamento/material/substância, sendo responsável o fornecedor do produto.</p>

    <h3><b>DA PROTEÇÃO DE DADOS</b></h3>

    <h4><b>CLÁUSULA 7ª:</b></h4>
    
    <p>Em cumprimento à Lei Geral de Proteção de Dados - LGPD (Lei 13.709/2018) a CONTRATADA informa a CONTRATANTE que os dados pessoais coletados no contexto da contratação serão utilizados para a finalidade de viabilizar a execução do presente Contrato e serão armazenados durante a sua vigência ou por período superior nos casos em que sua manutenção se justificar em outra hipótese legal prevista na LGPD.</p>

    <p><b>Parágrafo Único:</b> As Partes declaram-se cientes dos direitos, obrigações e penalidades aplicáveis constantes da Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018) ("LGPD"), e obrigam-se a adotar todas as medidas razoáveis para garantir, por si, bem como seu pessoal, colaboradores, empregados e subcontratados que utilizem os Dados Protegidos na extensão autorizada na referida LGPD.</p>

    <h3><b>DA RESCISÃO CONTRATUAL</b></h3>

    <h4><b>CLÁUSULA 8ª:</b></h4>
    
    <p>Além das hipóteses legais, o presente instrumento poderá ser rescindido pelas partes, uma vez verificada a ocorrência do descumprimento de qualquer cláusula ou condição pactuada, bem como pela falência do relacionamento profissional-paciente, sob efeitos das consequências de estilo e daquelas neste instrumento dispostas.</p>

    <p><b>Parágrafo Primeiro:</b> A parte que der causa à rescisão do contrato permanecerá responsável por todas as perdas e danos ocasionados e provados à parte inocente.</p>

    <h3><b>DO EQUILÍBRIO CONTRATUAL</b></h3>

    <h4><b>CLÁUSULA 9ª:</b></h4>

    <p>Ajustam as partes, nos termos dos arts. 317, 478 e 479 do Código Civil, e demais dispositivos legais aplicáveis à espécie, que na hipótese da ocorrência, por motivos imprevisíveis, de desproporção manifesta entre o custo do serviço estipulado no momento da contratação da prestação devida e aquele do momento de sua execução, será realizado o reequilíbrio econômico-financeiro da avença de sorte a que se adeque o custo do serviço ao seu valor real, majorando-o.</p>

    <h3><b>DA ASSINATURA DIGITAL</b></h3>

    <h4><b>CLÁUSULA 10ª:</b></h4>
    
    <p>As partes reconhecem como válida e se comprometem a não impugnar a assinatura digital ou eletrônica do presente instrumento, conforme permitido pela legislação vigente, dispensada a assinatura física para a contração das obrigações aqui previstas.</p>

    <h3><b>DA AUTORIZAÇÃO DE IMAGEM</b></h3>

    <h4><b>CLÁUSULA 11ª:</b></h4>
    
    <p>Eu autorizo a disponibilidade dos registros de meu tratamento para estudos com fins científicos, ainda que em rede social on line, estando sempre preservada minha identidade.</p>

    <h3><b>TÍTULO EXTRAJUDICIAL</b></h3>

    <h4><b>CLÁUSULA 12ª:</b></h4>
    
    <p>As partes reconhecem o presente contrato como título executivo extrajudicial, nos termos do artigo 585, II, do Código de Processo Civil.</p>

    <h3><b>DO FORO:</b></h3>

    <h4><b>CLÁUSULA 13ª:</b></h4>
    
    <p>As partes elegem, para dirimir quaisquer dúvidas a respeito do presente contrato, o foro da Comarca sede da clínica ou então o foro mais próximo dentro da circunscrição.</p>

    <p>E, por estarem justos e contratados, firmam o presente Contrato em 02 (duas) vias de igual teor e forma.</p>




    <div style="display: flex; flex-direction: column; justify-content: center; height: 350px;">
    <div style="text-align: center;">
      <span style="background-color: ${contractData.city ? '#4d92ec' : '#d0021b'}; color: white;padding: 4px;border-radius: 3px;font-weight: bold;font-style: normal;display: inline-block;line-height: 12px;">${contractData.city || 'Cidade contratada'}</span>, 19 de novembro de 2023
    </div>
  
    <div style="text-align: center; margin-top: 50px;">
      ____________________________________
      <br>CONTRATANTE
      <br>Paciente (contratante)
    </div>
  
    <div style="text-align: center; margin-top: 50px;">
      ____________________________________
      <br>CONTRATADO
      <br>Responsável
    </div>
  </div>
    `);
  }, [contractData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContractData({ ...contractData, [name]: value });
  };

const handleContractDataChange = (name, value) => {
  setContractData(prevData => ({ ...prevData, [name]: value }));
};

const handleNewContractClick = () => {
  // Aqui você pode preencher os dados automaticamente se necessário
  // Por exemplo, se você já tem dados do paciente, você pode fazer:
  setContractData({ ...contractData, patientName: patient.name, cpf: patient.cpf });
  setIsContractModalOpen(true);
};

const handleCloseContractModal = () => {
  setIsContractModalOpen(false);
};

const handleSubmitContract = () => {

 console.log(contractData);

if (editorRef.current) {
  editorRef.current.execCommand('mcePrint');
}
saveContract(); //passar para o banco de dados
};

const renderContractModal = () => (
  <Dialog open={isContractModalOpen} onClose={handleCloseContractModal} fullScreen  >
    
    <DialogContent sx={{display:'flex',justifyContent:'center', gap:'15px', paddingBottom:'0px !important'}} >
      {/* Aqui você coloca os campos do formulário e o TinyMCE */}
      <Paper sx={{padding:1.5,maxWidth:300,minHeight:1015}}>
        <h2 style={{font: "400 19px/31px Roboto,Helvetica Neue,sans-serif", letterSpacing: "normal", margin: "3px 0 8px 0",fontWeight: "500 !important"}}><b>Contratante</b></h2>
        <TextField
          fullWidth
          margin="normal"
          name="patientName"
          label="Nome Paciente"
          size="small"
          required
          value={contractData.patientName}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="cpf"
          label="CPF"
          size="small"
          required
          value={contractData.cpf}
          onChange={handleInputChange}
        />
        <h2 style={{font: "400 19px/31px Roboto,Helvetica Neue,sans-serif", letterSpacing: "normal", margin: "20px 0 8px 0",fontWeight: "500 !important"}}><b>Endereço contratante</b></h2>
        <TextField
          fullWidth
          margin="normal"
          name="cep"
          label="CEP"
          size="small"
          required
          value={contractData.cep}
          onChange={handleInputChange}
          
        />
        <TextField
          fullWidth
          margin="normal"
          name="street"
          label="Rua"
          size="small"
          required
          value={contractData.street}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="neighborhood"
          label="Bairro"
          size="small"
          required
          value={contractData.neighborhood}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="city"
          label="Cidade"
          size="small"
          required
          value={contractData.city}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="normal">
        
        <TextField
          labelId="state-label"
          id="state"
          value={contractData.state}
          label="Estado"
          onChange={handleInputChange}
          select
          name="state"
          size="small"
          required
        >
          {estadosBrasileiros.map((estado) => (
            <MenuItem key={estado} value={estado}>{estado}</MenuItem>
          ))}
        </TextField>
      </FormControl>
      <h2 style={{font: "400 19px/31px Roboto,Helvetica Neue,sans-serif", letterSpacing: "normal", margin: "20px 0 8px 0",fontWeight: "500 !important"}}><b>Contratada</b></h2>
       <TextField
            size="small"
            fullWidth
            labelId="professional-label"
            id="professional"
            value={professional}
            label="Profissional Contratada"
            required
            onChange={handleProfessionalChange}
            select
          >
            {professionals.map((prof) => (
              <MenuItem key={prof.id} value={prof.id}>
                {prof.nome}
              </MenuItem>
            ))}
          </TextField>
        <TextField
          fullWidth
          margin="normal"
          name="contractedCpf"
          label="CPF"
          size="small"
          required
          value={contractData.contractedCpf}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="contractCity"
          label="Cidade"
          size="small"
          required
          value={contractData.contractCity}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="contractValue"
          label="Valor Contrato"
          size="small"
          
          required
          value={contractData.contractValue}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          name="treatments"
          label="Tratamentos"
          size="small"
          multiline
          rows={4}
          value={contractData.treatments}
          onChange={handleInputChange}
        />
      </Paper>
      {/* ... Outros campos de entrada ... */}
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        apiKey="ulvad2203an7i2wv0odtpknes1k84pi4p7x3rl3sixe70ciz"
        value={contractContent}
        init={{
          height: 4550,
          width: 800,
          menubar: 'file',
          plugins: [
            'advlist autolink lists help link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount print'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'print | removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={(newContent) => {
          setContractContent(newContent);
        }}
      />
    </DialogContent>
    <DialogActions sx={{paddingRight:'10%'}}>
      <Button onClick={handleCloseContractModal} sx={{color:'black',lineHeight: '36px', fontWeight:500}}>
        Fechar
      </Button>
      <Button onClick={handleSubmitContract}  variant="contained" disabled={!isFormValid} sx={{backgroundColor:'#50ae54'}}>
        Salvar Contrato
      </Button>
    </DialogActions>
  </Dialog>
);


  const handleOpenHistoryModal = async (documentType) => {
    setCurrentDocumentType(documentType);
    setIsHistoryModalOpen(true);
  
    let url;
    switch (documentType) {
      case 'Atestados':
        url = `https://clinicapi-api.azurewebsites.net/Atestado/ListarAtestados/?id=${id}`;
        break;
      case 'Contratos':
        url = `https://clinicapi-api.azurewebsites.net/Contrato/ListarContrato/?id=${id}`;
        break;
      case 'Receituários':
        url = `https://clinicapi-api.azurewebsites.net/Receituario/ListarReceituarios/?id=${id}`;
        break;
      default:
        setDocumentHistory([]);
        return;
    }
  
    try {
      const response = await axios.get(url);
      if (response.data && response.data.sucesso) {
        const recordsWithNames = await Promise.all(response.data.retorno.map(async (record) => {
          const professionalName = await fetchProfessionalName(record.profissionalId);
          return { ...record, professionalName };
        }));
        setDocumentHistory(recordsWithNames);
        
        // Cria um objeto mapeando professionalId para professionalName
        const namesMap = recordsWithNames.reduce((acc, record) => {
          acc[record.profissionalId] = record.professionalName;
          return acc;
        }, {});
        setProfessionalNames(namesMap);
      } else {
        setDocumentHistory([]);
        setProfessionalNames({});
      }
    } catch (error) {
      console.error("Erro ao carregar o histórico:", error);
      setDocumentHistory([]);
      setProfessionalNames({});
    }
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };
  

  const handleOpenReadOnlyModal = (evolution) => {

    setReadOnlyModal(true); // Ativar o modo somente leitura
    setIsAddEvolutionModalOpen(true); // Abrir o modal
  };

  const handleAdd = async (professionalId, selectedDate, description) => {
    const apiUrl =
      "https://clinicapi-api.azurewebsites.net/Evolucao/CriarEvolucao";
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Formata a data para o formato esperado pela API
    const evolutionData = {
      pacienteId: patient.id, // Supondo que "patient.id" seja o ID do paciente no estado do componente pai
      profissionalId: professionalId,
      data: formattedDate,
      descricao: description,
    };
    console.log(evolutionData);
    try {
      const response = await axios.post(apiUrl, evolutionData);
      if (response.status === 200) {
        console.log("Evolução adicionada com sucesso");
        handleCloseEvolutionModal(); // Fechar o modal
        setIsAddEvolutionModalOpen(false);
        toast.success("Evolução adicionada com sucesso!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchEvolutions();
      } else {
        toast.error("Erro ao inserir os dados. Tente novamente!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        console.error("Erro ao adicionar evolução. Status:", response.status);
      }
    } catch (error) {
      toast.error("Erro ao fazer a solicitação de evolução. Tente novamente.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      console.error("Erro ao adicionar evolução:", error);
    }
  };

  const formatDateFromRecord = (record, documentType) => {
    let date;
    if (documentType === 'Receituários') {
      date = new Date(record.dataReceita);
    } else {
      date = new Date(record.data);
    }
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const fetchProfessionalName = async (profissionalId) => {
    try {
      const response = await axios.get(`https://clinicapi-api.azurewebsites.net/Usuario/BuscarUsuario/?id=${profissionalId}`);
      if (response.data && response.data.sucesso) {
        return response.data.retorno.nome; // Retorna o nome do profissional
      }
    } catch (error) {
      console.error("Erro ao buscar o nome do profissional:", error);
      return "Nome não encontrado"; // Retorna um valor padrão em caso de erro
    }
  };

  const handleEdit = (user) => {

    onViewClick(user); 
  };

  const renderEvolutions = () => {
    if (evolutions.length === 0) {
      return <NoEvolutions />;
    }

    return evolutions.map((evolution, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography>
          {new Date(evolution.data).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}{" "}
          | {evolution.professionalName}
        </Typography>
        <Box>
          <Button
           onClick={() => handleOpenReadOnlyModal(evolution)}
            sx={{
              color: "white",
              backgroundColor: "#1976d2",
              minWidth:'34px !important',
              "&:hover": {
                backgroundColor: "#063f78",
              },
            }}
          >
            <InfoIcon sx={{color:'white'}}/>
          </Button>
          <Button
            onClick={() => handleDeleteEvolution(evolution.id)}
            sx={{
              color: "white",
              backgroundColor: "red",
              minWidth:'34px !important',
              marginLeft: "8px", // Espaço entre os botões
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            <DeleteIcon sx={{color:'white'}}/>
          </Button>
        </Box>
      </Box>
    ));
  };

  useEffect(() => {
    fetch(
      `https://clinicapi-api.azurewebsites.net/Agendamento/ListarAgendamentos/?id=${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.sucesso && Array.isArray(data.retorno)) {
          setAppointments(data.retorno); // Acessar a propriedade "retorno" para os agendamentos
        }
        console.log(data);
      })
      .catch((error) => console.error("Erro ao carregar agendamentos:", error));
  }, [id]);

  useEffect(() => {
    fetch(
      `https://clinicapi-api.azurewebsites.net/Paciente/BuscarPaciente/?id=${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.retorno) {
          const idade = calcularIdade(data.retorno.dataNascimento);
          setPatient({
            name: data.retorno.nome,
            phone: data.retorno.telefone.replace(/[^\d]/g, ""),
            telefone: data.retorno.telefone,
            id: data.retorno.id,
            email: data.retorno.email,
            cpf: data.retorno.cpf,
            dataNascimento: data.retorno.dataNascimento,
            ...data.retorno, // espalha os outros dados do paciente
            idade: idade, // idade calculada
          });
          const res = data.retorno.responsavel;
          if (res) {
            setResponsible({
              name: res.nome,
              phone: res.telefone,
              birthDate: formatarData(res.dataNascimento),
              cpf: res.cpf,
            });
          }
        }
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do paciente:", error)
      );
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode integrar a lógica para enviar os dados para a API ou manipular da maneira que precisar
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  function formatarData(dataNascimento) {
    const dataObj = new Date(dataNascimento);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  const handleOpenEvolutionModal = () => {
    setIsAddEvolutionModalOpen(true);
  };

  const handleCloseEvolutionModal = () => {
    setIsAddEvolutionModalOpen(false);
    setReadOnlyModal(false);
  };

  const fetchEvolutions = async () => {
  try {
    const response = await axios.get(
      `https://clinicapi-api.azurewebsites.net/Evolucao/ListarEvolucao/?id=${id}`
    );
    if (response.data && response.data.sucesso) {
      const evolutionsWithNames = await Promise.all(response.data.retorno.map(async (evo) => {
        const professionalName = await fetchProfessionalName(evo.profissionalId);
        return { ...evo, professionalName };
      }));
      setEvolutions(evolutionsWithNames);
    }
  } catch (error) {
    console.error("Erro ao carregar evoluções:", error);
  }
};

  useEffect(() => {
    fetchEvolutions();
  }, [id]);

  const handleDeleteEvolution = async (evolutionId) => {
    const deleteUrl = `https://clinicapi-api.azurewebsites.net/Evolucao/DeletarEvolucao/?id=${evolutionId}`;

    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 200) {
        console.log("Evolução deletada com sucesso");
        toast.success("Evolução excluida com sucesso!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchEvolutions(); // Atualiza os dados na tela
      } else {
        toast.success("Erro ao excluir a evolução, tente novamente!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        console.error("Erro ao deletar evolução. Status:", response.status);
      }
    } catch (error) {
      toast.success("Erro ao excluir a evolução, tente novamente!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      console.error("Erro ao deletar evolução:", error);
    }
  };

  const NoEvolutions = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={12}
    >
      <Typography variant="subtitle1">
        O paciente não possui evoluções
      </Typography>
      <Button
        onClick={handleOpenEvolutionModal}
        sx={{ backgroundColor: "#50ae54" }}
        variant="contained"
      >
        ADICIONAR EVOLUÇÃO
      </Button>
    </Box>
  );

  const DocumentIcon = ({ svg }) => {
    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  };

  const contratoSvg = `  <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
    <path d="M40 80C61.8486 80 79.5605 62.0914 79.5605 40C79.5605 17.9086 61.8486 0 40 0C18.1514 0 0.439575 17.9086 0.439575 40C0.439575 62.0914 18.1514 80 40 80Z" fill="#16835B"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5442 13.6589H59.455V66.342H20.5442V13.6589Z" fill="white"></path>
    <path opacity="0.6" d="M30.109 59.4879H36.5943M30.109 57.5363H36.5943H30.109Z" stroke="#2095F3" stroke-width="1.02" stroke-linecap="square"></path>
    <path opacity="0.6" d="M44.109 59.4879H50.5943M44.109 57.5363H50.5943H44.109Z" stroke="#2095F3" stroke-width="1.02" stroke-linecap="square"></path>
    <path d="M25 26H56V27.3H25V26Z" fill="#9D9D9D"></path>
    <path d="M25 41H56V42.3H25V41Z" fill="#9D9D9D"></path>
    <path d="M31 21H49V22.3H31V21Z" fill="#9D9D9D"></path>
    <path d="M25 29H56V30.3H25V29Z" fill="#9D9D9D"></path>
    <path d="M25 44H56V45.3H25V44Z" fill="#9D9D9D"></path>
    <path d="M25 32H56V33.3H25V32Z" fill="#9D9D9D"></path>
    <path d="M25 35H56V36.3H25V35Z" fill="#9D9D9D"></path>
</svg>`; // Replace with your SVG string for "Contrato"
  const receituarioSvg = `<svg width="100%" height="100%" viewBox="0 0 90 91" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g fill="none" fill-rule="evenodd"><ellipse fill="#42A5F5" cx="45" cy="45.5" rx="45" ry="45.5"></ellipse><path d="M36.516 21.085h8.115M37.254 22.565h8.853" stroke="#979797" stroke-linecap="square"></path><path fill="#FFF" d="M22.869 15.537H67.13v59.927H22.869z"></path><path d="M37.623 34.033h15.492M28.77 41.43h15.492M28.77 44.39h7.378M28.77 47.35h32.46M28.77 50.309h32.46" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M40.574 66.585h7.377M40.574 68.805h7.377" stroke="#2095F3" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M36.885 25.154h5.164M36.885 22.935h5.164" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".3"></path><path opacity=".2" fill="#000" d="M26.558 19.976h8.115v8.138h-8.115z"></path></g></svg>`; // Replace with your SVG string for "Receituário"
  const atestadosSvg = `<svg width="100%" height="100%" viewBox="0 0 90 91" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g fill="none" fill-rule="evenodd"><ellipse fill="#66BB6A" cx="45" cy="45.5" rx="45" ry="45.5"></ellipse><path d="M36.516 21.085h8.115M37.254 22.565h8.853" stroke="#979797" stroke-linecap="square"></path><path fill="#FFF" d="M22.869 15.537H67.13v59.927H22.869z"></path><path d="M37.623 34.033h15.492M28.77 47.35h32.46M28.77 44.39h32.46M28.77 41.43h32.46M28.77 50.309h32.46" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M36.885 25.154h5.164M36.885 22.935h5.164" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".3"></path><path opacity=".2" fill="#000" d="M26.558 19.976h8.115v8.138h-8.115z"></path></g></svg>`; // Replace

  const DocumentCard = ({ title, icon, onNewClick }) => {
    return (
      <Card sx={{ minWidth: 275, textAlign: "center", margin: "8px" }}>
        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "80px", height: "80px" }}>
            <DocumentIcon svg={icon} />
          </div>
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#a9a9a9 !important",
              font: "500 17px/28px Roboto,Helvetica Neue,sans-serif",
            }}
          >
            {title}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            sx={{
              color: "black",
              textTransform: "uppercase",
              lineHeight: "36px",
              fontFamily: "Roboto,Helvetica Neue,sans-serif",
              fontSize: "14px",
              fontWeight: "600",
            }}
            size="small"
            onClick={() => handleOpenHistoryModal(title)}>
            Histórico
          </Button>
          <Button
            sx={{
              textTransform: "uppercase",
              lineHeight: "36px",
              fontFamily: "Roboto,Helvetica Neue,sans-serif",
              fontSize: "14px",
              fontWeight: "600",
            }}
            size="small"
            onClick={onNewClick}
          >
            Novo
          </Button>
        </CardActions>
      </Card>
    );
  };

  const renderAppointments = () => {
    const currentDate = new Date();
  
    // Ordena os agendamentos pela data e hora da consulta (mais recente primeiro)
    const sortedAppointments = appointments.sort((a, b) => 
      new Date(b.dataConsulta + "T" + b.horaInicio) - 
      new Date(a.dataConsulta + "T" + a.horaInicio)
    );
  
    // Limita para os 10 agendamentos mais recentes
    const recentAppointments = sortedAppointments.slice(0, 10);
  
    return recentAppointments.map((appointment, index) => {
      // Cria um objeto Date para a data e hora do agendamento
      const appointmentDate = new Date(
        appointment.dataConsulta + "T" + appointment.horaInicio
      );
  
      // Formata a hora para exibir apenas horas e minutos
      const timeString = appointmentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      // Verifica se a data do agendamento é anterior à data atual
      const isPastAppointment = appointmentDate < currentDate;
  
      // Aplica estilo com base na comparação de datas
      const appointmentStyle = {
        display: 'flex',
        gap: '10px',
        fontSize: '18px',
        color: isPastAppointment ? 'darkBlue' : 'green',
      };
  
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pb: 1,
            justifyContent: 'space-around',
          }}
        >
          <Typography variant="body1" sx={appointmentStyle}>
            {appointmentDate.toLocaleDateString()} - {timeString}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {patient.name}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {appointment.sala}
          </Typography>
          <Tooltip title={appointment.observacao} placement="bottom" arrow>
            <InfoIcon sx={{ color: 'lightblue', ml: 1, cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      );
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: //Sobre
        return (
          <Grid
            container
            spacing={2}
            padding={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} md={6}>
              <div>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  {patient.name}{" "}
                  {patient.idade ? `(${patient.idade} anos)` : ""}
                </Typography>
                <div style={{ display: "flex", gap: "50px", padding: 18 }}>
                  <div style={{ padding: 2, paddingLeft: 13 }}>
                    <Typography variant="body1" color="textSecondary">
                      Celular:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Número paciente:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Data de Nascimento:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Email:
                    </Typography>
                  </div>
                  <div sx={{ padding: 2 }}>
                    <Typography variant="body1" color="textPrimary">
                      {patient.telefone}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.id}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.dataNascimento
                        ? formatarData(patient.dataNascimento)
                        : "Carregando..."}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.email}
                    </Typography>
                  </div>
                </div>
              </Paper>
              </div>
              <div>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  Responsável
                </Typography>
                <div style={{ display: "flex", gap: "50px", padding: 18 }}>
                  {responsible.name ? (
                    <>
                      <div style={{ padding: 2, paddingLeft: 13 }}>
                        <Typography variant="body1" color="textSecondary">Nome:</Typography>
                        <Typography variant="body1" color="textSecondary">Celular:</Typography>
                        <Typography variant="body1" color="textSecondary">Data de Nascimento:</Typography>
                        <Typography variant="body1" color="textSecondary">CPF:</Typography>
                      </div>
                      <div sx={{ padding: 2 }}>
                        <Typography variant="body1" color="textPrimary">{responsible.name}</Typography>
                        <Typography variant="body1" color="textPrimary">{responsible.phone}</Typography>
                        <Typography variant="body1" color="textPrimary">{responsible.birthDate}</Typography>
                        <Typography variant="body1" color="textPrimary">{responsible.cpf}</Typography>
                      </div>
                    </>
                  ) : (
                    <>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width: "100%",height:'120px'}}>
                      <Typography variant="body1" style={{ textAlign: "center", width: "100%",fontFamily: '"Roboto","Helvetica","Arial",sans-serif',fontWeight: '400',fontSize: '1rem',lineHeight: '1.75',letterSpacing: '0.00938em',fontSize: '1.2em',fontWeight: '400' }}>
                        Nenhum responsável cadastrado.
                      </Typography>
                      <Typography variant="body1" style={{ textAlign: "center", width: "100%",fontSize: '1.0em' }}>
                        Mas você pode cadastrar editando o paciente.
                      </Typography>
                    </div>
                    </>
                  )}
                </div>
              </Paper>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  Consultas <small>(10 Ultimos)</small>
                </Typography>
                <div style={{ padding: 18 }}>{renderAppointments()}</div>
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: //Documentos
        if (showPrescriptionForm) {
          return (
            <ReceituarioForm
              patient={patient}
              onClose={() => setShowPrescriptionForm(false)}
            />
          );
        }
        if (showAtestadoForm) {
          return (
            <AtestadoForm
              patient={patient}
              onClose={() => setShowAtestadoForm(false)}
            />
          );
        }
        return (
          <Grid
            container
            spacing={2}
            pt={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} sm={4} pl={0}>
              <DocumentCard 
              title="Contratos" 
              icon={contratoSvg} 
              onHistoryClick={() => handleOpenHistoryModal('Contrato')}
              onNewClick={handleNewContractClick}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DocumentCard
                title="Receituários"
                icon={receituarioSvg}
                onNewClick={() => setShowPrescriptionForm(true)}
                onHistoryClick={() => handleOpenHistoryModal('Receituário')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DocumentCard
                title="Atestados"
                icon={atestadosSvg}
                onNewClick={() => setShowAtestadoForm(true)}
                onHistoryClick={() => handleOpenHistoryModal('Atestados')}
                />
            </Grid>
          </Grid>
        );

      case 2: //Tratamento
        return (
          <Grid
            container
            spacing={2}
            padding={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} md={7.5} sx={{ height: "100%" }}>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  Adicionar tratamento
                </Typography>
                <div style={{ display: "flex", gap: "50px", padding: 18 }}>
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          required
                          id="treatment"
                          label="Tratamento"
                          value={treatment}
                          onChange={(e) => setTreatment(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          id="tooth-region"
                          label="Dentes/Região"
                          value={toothRegion}
                          onChange={(e) => setToothRegion(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          id="value"
                          label="Valor R$"
                          type="number"
                          required
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <FormControl
                          fullWidth
                          required
                          margin="normal"
                          size="small"
                        >
                          <InputLabel id="professional-label">
                            Profissional
                          </InputLabel>
                          <Select
                            labelId="professional-label"
                            id="professional"
                            value={professional}
                            label="Profissional"
                            onChange={(e) => setProfessional(e.target.value)}
                          >
                            <MenuItem value={10}>Profissional A</MenuItem>
                            <MenuItem value={20}>Profissional B</MenuItem>
                            <MenuItem value={30}>Profissional C</MenuItem>
                          </Select>
                          <FormHelperText>
                            Este campo é obrigatório
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ backgroundColor: "#50ae54", width: "220px" }}
                      >
                        ADICIONAR TRATAMENTO
                      </Button>
                    </div>
                  </form>
                </div>
                <Grid item xs={12} pb={0.3}>
                  <Paper
                    elevation={3}
                    sx={{ mt: "0 !important", m: 2, height: "210px" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{
                        backgroundColor: "whitesmoke",
                        color: "#696969",
                        padding: 0.5,
                        paddingLeft: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Tratamentos
                      <div style={{ fontSize: "14px", paddingRight: "10px" }}>
                        <Switch color="primary" />
                        <label style={{ fontSize: "14px" }}>
                          Mostrar finalizados
                        </label>
                      </div>
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      marginTop="50px"
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "1.2em", fontWeight: 400 }}
                      >
                        Nenhum tratamento cadastrado ainda.
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "1.0em",
                          fontWeight: 400,
                          margin: "0 0 8px",
                        }}
                      >
                        Mas você pode começar nos campos acima digitando o nome
                        do tratamento.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Paper elevation={3} sx={{ marginBottom: 3, height: "370px" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 2,
                  }}
                >
                  Evoluções
                  <IconButton onClick={handleOpenEvolutionModal}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Typography>
                <div style={{ padding: 18 }}>{renderEvolutions()}</div>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?phone=55${patient.phone}&text=Ol%C3%A1,%20Paciente`;

  const handleBack = () => {
    navigate("/app/paciente");
  };

  return (
    <>
      <Paper style={{ width: "94vw", height: "94vh", overflow: "hidden" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Box display="flex" alignItems="center">
            <Button onClick={handleBack} sx={{ marginRight: 0 }}>
              <ArrowBackIcon />
            </Button>
            <PersonIcon sx={{ fontSize: 60, marginRight: 2 }} />{" "}
            {/* User Icon */}
            <Box>
              <Typography variant="h5">{patient.name}</Typography>
              <div style={{ display: "flex", gap: "3px" }}>
                <Typography
                  sx={{ color: "#696969 !important", fontSize: "14px" }}
                  variant="subtitle1"
                >
                  {patient.telefone} -{" "}
                </Typography>
                <Typography
                  sx={{ color: "#696969 !important", fontSize: "14px" }}
                  variant="subtitle1"
                >
                  Nº paciente: {patient.id}
                </Typography>
              </div>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white !important",
                color: "black ",
                marginLeft: 4,
              }}
              onClick={() => handleEdit(user)}
            >
              Editar
            </Button>
          </Box>
          <Box>
            <Tooltip title="Conversar pelo Whastaspp Web">
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon sx={{ color: "#129909",fontSize:'16px' }} />}
                href={whatsappUrl}
                target="_blank"
                sx={{ backgroundColor: "#E9E9E9", color: "#129909",border:0,boxShadow:'none !important',textTransform:'none !important',fontSize:'14px',
                "&:hover": {
                  backgroundColor: "#E1E1E1",
                }, }}
              >
                Conversar
              </Button>
            </Tooltip>

          </Box>
        </Box>

        <AppBar position="static">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            sx={{ zIndex: 10, backgroundColor: "#FAFAFA", color: "#666666" }}
          >
            <Tab label="SOBRE" />
            <Tab label="DOCUMENTOS" />
            <Tab label="TRATAMENTOS" />
          </Tabs>
        </AppBar>

        <div>{renderTabContent()}</div>
      </Paper>
      <AddEvolutionModal
        open={isAddEvolutionModalOpen}
        handleClose={handleCloseEvolutionModal}
        handleAdd={handleAdd}
        setIsAddEvolutionModalOpen={setIsAddEvolutionModalOpen}
        id={id}
        handleDeleteEvolution={handleDeleteEvolution}
        readOnlyModal={readOnlyModal} 
      />

      <ToastContainer />
      {renderContractModal()}

      <Dialog open={isHistoryModalOpen} onClose={handleCloseHistoryModal} fullWidth={true} maxWidth={'md'}>
        <DialogTitle sx={{fontSize:'20px'}}>{`Histórico de ${currentDocumentType}`}</DialogTitle>
        <DialogContent>
          {documentHistory.length > 0 ? (
            documentHistory.map((record) => (
              <Box key={record.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <Typography variant="body1">Data: {formatDateFromRecord(record, currentDocumentType)}</Typography>
                <Typography variant="body1">Profissional: {professionalNames[record.profissionalId]}</Typography>
                <Button onClick={() => console.log('Imprimir', record)} sx={{backgroundColor:'E9E9E9 !important'}}>
                  <PrintIcon sx={{color:'blue',backgroundColor:'E9E9E9 !important'}} />
                </Button>
              </Box>
            ))
          ) : (
            <DialogContentText sx={{ textAlign: 'center' }}>
              <strong>{patient.name}</strong> não possui {currentDocumentType.toLowerCase()} gerados.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{paddingRight:3,paddingBottom:2}}>
          <Button onClick={handleCloseHistoryModal} color="primary" sx={{color:'black'}} >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
}

export default PatientPage;
