import React, { useState } from 'react';
import '../style/css/ModalPaciente.css';
import 'devextreme/dist/css/dx.light.css';
import {
  Box,
  FormControl,
  Input,
  FormLabel,
  HStack,
  RadioGroup,
  Radio,
  Button,
  Textarea
} from "@chakra-ui/react";
import {
  Form,
  SimpleItem,
  GroupItem,
  TabbedItem,
  Tab,
  TabPanelOptions
} from 'devextreme-react/form';
import x from "../style/img/cancelar.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";

function Modal() {

  const employee = {
    name: 'John Heart',
    position: 'CEO',
    hireDate: new Date(2012, 4, 13),
    officeNumber: 901,
    phone: '+1(213) 555-9392',
    skype: 'jheart_DX_skype',
    email: 'jheart@dx-email.com',
    notes: 'John has been in the Audio/Video industry since 1990.'
  }

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const notify = () => {
    toast.success('Cadastro realizado com sucesso!', {
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };


  
  return (
    <div>
       <a href="#" onClick={openModal} className='a-linha'>
        Cadastrar Paciente
      </a>
      {isOpen && (
        <div className="modal-overlay" >
          <div className="modal-content" >
            <div className='positionButton'>
              <Button className="close-button" onClick={closeModal}>
                <img className='tamImg' src={x} alt="Fechar"/>
              </Button>
            </div>
            <FormControl display="flex" flexDir="column" gap="4" >
              <HStack spacing="4">
                <div className="titulo">
                  <p className='titleForm'>Dados do Paciente</p>
                </div>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel >Nome Completo</FormLabel>
                  <Input type="text" id="nome" name="nome" />
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="cel">Celular</FormLabel>
                  <Input id="cel" type="tel" as={InputMask} mask="(**)*****-****" maskChar={null} />
                </Box>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel htmlFor="nasc">Data de Nascimento</FormLabel>
                  <Input id="nasc" type="date" required/>
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="natural">CPF</FormLabel>
                  <Input id="CPF" as={InputMask} mask="***.***.***-**" maskChar={null} required/>
                </Box>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel>Sexo</FormLabel>
                  <RadioGroup defaultValue="Masculino">
                    <HStack spacing="24px">
                      <Radio value="Masculino">Masculino</Radio>
                      <Radio value="Feminino">Feminino</Radio>
                    </HStack>
                  </RadioGroup>
                </Box>
              </HStack>
              <hr></hr>
              <HStack spacing="4">
                <div className="titulo">
                  <p className='titleForm'>Dados do Acompanhante</p>
                </div>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel htmlFor="nome">Nome Completo</FormLabel>
                  <Input id="nome" required />
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="cel">Celular</FormLabel>
                  <Input id="cel" type="tel"  as={InputMask} mask="(**)*****-****" maskChar={null}/>
                </Box>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel htmlFor="nasc">Data de Nascimento</FormLabel>
                  <Input id="nasc" type="date" />
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="natural">CPF</FormLabel>
                  <Input id="CPF" as={InputMask} mask="***.***.***-**" maskChar={null}/>
                </Box>
              </HStack>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel htmlFor="natural">Observação</FormLabel>
                  <Textarea name="obs" id="obs" cols="30" rows="10">
                  </Textarea>
                </Box>
              </HStack>
              <Form
                formData={employee}
                colCount={1}>
                <GroupItem caption=" ">
                  <TabbedItem>
                    <TabPanelOptions height={260} />
                    <Tab title="Informações Adicionais">
                      <SimpleItem dataField="phone" />
                      <SimpleItem dataField="skype" />
                      <SimpleItem dataField="email" />
                    </Tab>
                    <Tab title="Endereço">
                      <SimpleItem dataField="notes" />
                    </Tab>
                  </TabbedItem>
                </GroupItem>
              </Form>

              <HStack justify="center">
                <Button
                  w={240}
                  p="6"
                  type="submit"
                  bg="teal.600"
                  color="white"
                  fontWeight="bold"
                  fontSize="xl"
                  mt="2"
                  _hover={{ bg: "teal.800" }}
                  onClick={() => {
                    closeModal(); // Feche o modal primeiro
                    setTimeout(() => {
                      notify(); // Notifique após um curto atraso
                    }, 50); // Ajuste o tempo de atraso conforme necessário
                  }}
                >
                  Enviar
                </Button>
              </HStack>
            </FormControl>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
export default Modal;